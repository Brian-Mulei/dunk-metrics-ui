import { gameStart } from "./GameTime";

export const STORAGE_KEY = "parlays";

const emptyState = () => ({ activeId: null, slips: [] });

export const loadParlays = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && Array.isArray(saved.slips) ? saved : emptyState();
  } catch {
    return emptyState();
  }
};

export const saveParlays = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // private mode or full storage: the slip still works until the page reloads
  }
};

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

const nextSlipName = (slips) => {
  const numbers = slips.map((s) => Number(/^Slip (\d+)$/.exec(s.name)?.[1] ?? 0));
  return `Slip ${Math.max(slips.length, ...numbers) + 1}`;
};

export const createSlip = (state, name, now = Date.now()) => {
  const slip = { id: newId(), name: name?.trim() || nextSlipName(state.slips), createdAt: now, legs: [] };
  return { activeId: slip.id, slips: [...state.slips, slip] };
};

export const renameSlip = (state, slipId, name) => ({
  ...state,
  slips: state.slips.map((s) => (s.id === slipId && name.trim() ? { ...s, name: name.trim() } : s)),
});

export const deleteSlip = (state, slipId) => {
  const slips = state.slips.filter((s) => s.id !== slipId);
  return { activeId: state.activeId === slipId ? slips.at(-1)?.id ?? null : state.activeId, slips };
};

export const setActiveSlip = (state, slipId) => ({ ...state, activeId: slipId });

export const activeSlipOf = (state) => state.slips.find((s) => s.id === state.activeId) ?? null;

export const hasStarted = (leg, now = Date.now()) => gameStart(leg).getTime() <= now;

export const isExpired = (slip, now = Date.now()) => slip.legs.some((leg) => hasStarted(leg, now));

export const firstStarted = (slip, now = Date.now()) =>
  slip.legs.filter((leg) => hasStarted(leg, now)).sort((a, b) => gameStart(a) - gameStart(b))[0] ?? null;

const legFrom = (game, pickTeamId, probability) => ({
  gameId: game.id,
  pickTeamId,
  homeTeamId: game.homeTeamId,
  awayTeamId: game.awayTeamId,
  homeTeam: game.homeTeam,
  awayTeam: game.awayTeam,
  startTimeUtc: game.startTimeUtc,
  date: game.date,
  startingTime: game.startingTime,
  probability: probability ?? null,
});

const updateSlip = (state, slipId, update) => ({
  ...state,
  slips: state.slips.map((s) => (s.id === slipId ? update(s) : s)),
});

// picking the same team again removes the leg, picking the other team swaps it
export const togglePick = (state, game, pickTeamId, probability, now = Date.now()) => {
  if (hasStarted(game, now)) return state;
  let next = state;
  let slip = activeSlipOf(next);
  if (!slip || isExpired(slip, now)) {
    next = createSlip(next, null, now);
    slip = activeSlipOf(next);
  }
  const existing = slip.legs.find((leg) => leg.gameId === game.id);
  const legs = existing?.pickTeamId === pickTeamId
    ? slip.legs.filter((leg) => leg.gameId !== game.id)
    : existing
      ? slip.legs.map((leg) => (leg.gameId === game.id ? legFrom(game, pickTeamId, probability) : leg))
      : [...slip.legs, legFrom(game, pickTeamId, probability)];
  return updateSlip(next, slip.id, (s) => ({ ...s, legs }));
};

export const removeLeg = (state, slipId, gameId, now = Date.now()) =>
  updateSlip(state, slipId, (s) => (isExpired(s, now) ? s : { ...s, legs: s.legs.filter((leg) => leg.gameId !== gameId) }));

// copies scores, status and refreshed odds from fresh game/prediction data into every slip holding that game
export const mergeGameUpdates = (state, gamesById, predictionsById = {}, now = Date.now()) => ({
  ...state,
  slips: state.slips.map((slip) => ({
    ...slip,
    legs: slip.legs.map((leg) => {
      const game = gamesById[leg.gameId];
      const prediction = predictionsById[leg.gameId];
      let updated = leg;
      if (game) {
        updated = { ...updated, status: game.status, homeTeamScore: game.homeTeamScore, awayTeamScore: game.awayTeamScore };
      }
      if (prediction && !hasStarted(leg, now)) {
        updated = { ...updated, probability: pickProbability(prediction, leg.pickTeamId) };
      }
      return updated;
    }),
  })),
});

export const pickProbability = (prediction, teamId) =>
  prediction ? (teamId === prediction.homeTeamId ? prediction.homeWinProbability : prediction.awayWinProbability) : null;

export const isResolved = (leg) => leg.status === "Finished" || leg.status === "Postponed";

export const legResult = (leg, now = Date.now()) => {
  if (leg.status === "Postponed") return "postponed";
  if (leg.status === "Finished") {
    const pickedHome = leg.pickTeamId === leg.homeTeamId;
    const picked = pickedHome ? leg.homeTeamScore : leg.awayTeamScore;
    const other = pickedHome ? leg.awayTeamScore : leg.homeTeamScore;
    return picked > other ? "won" : "lost";
  }
  return hasStarted(leg, now) ? "live" : "upcoming";
};

// postponed legs are void, like at a sportsbook
export const slipResult = (slip, now = Date.now()) => {
  const results = slip.legs.map((leg) => legResult(leg, now)).filter((r) => r !== "postponed");
  if (results.length === 0) return "open";
  if (results.includes("lost")) return "busted";
  if (results.every((r) => r === "won")) return "hit";
  return results.some((r) => r !== "upcoming") ? "inPlay" : "open";
};

export const combinedProbability = (slip) => {
  const legs = slip.legs.filter((leg) => leg.status !== "Postponed");
  if (legs.length === 0 || legs.some((leg) => leg.probability == null)) return null;
  return legs.reduce((p, leg) => p * leg.probability, 1);
};
