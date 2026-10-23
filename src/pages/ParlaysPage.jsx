import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { getGamesByDay, getPredictions } from "../apis/apis";
import { useParlays } from "../utils/useParlays";
import { combinedProbability, firstStarted, hasStarted, isExpired, isResolved, legResult, slipResult } from "../utils/parlays";
import { apiDateParam, formatGameDate, formatGameTime, gameStart, localDateKey, userTimeZone } from "../utils/GameTime";
import { getTeamCode, getTeamLogoUrl } from "../utils/LogoPicker";

const POLL_MS = 60 * 1000;
// a game still unresolved this long after tip-off is stale data, not a live game worth polling
const LIVE_WINDOW_MS = 6 * 60 * 60 * 1000;

const pct = (p) => `${Math.round(p * 100)}%`;

const LEG_CHIP = {
  upcoming: { label: "Upcoming", className: "bg-surface-a40 text-light-a0" },
  live: { label: "Live", className: "bg-loss/15 text-loss" },
  won: { label: "Won", className: "bg-win/15 text-win" },
  lost: { label: "Lost", className: "bg-loss/15 text-loss" },
  postponed: { label: "Postponed", className: "bg-surface-a40 text-muted" },
};

const SLIP_CHIP = {
  open: { label: "Open", className: "bg-primary-a0/15 text-primary-a10" },
  inPlay: { label: "In play", className: "bg-score/15 text-score" },
  hit: { label: "Hit", className: "bg-win/15 text-win" },
  busted: { label: "Busted", className: "bg-loss/15 text-loss" },
};

const Chip = ({ chip }) => (
  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${chip.className}`}>{chip.label}</span>
);

const useNow = (intervalMs) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return now;
};

// fetches scores for started legs and fresh odds for upcoming ones, then writes them back into the slips
const useLegUpdates = (slips, mergeUpdates, now) => {
  const legs = slips.flatMap((s) => s.legs);
  const startedIds = [...new Set(legs.filter((l) => hasStarted(l, now) && !isResolved(l)).map((l) => l.gameId))];
  const upcomingIds = [...new Set(legs.filter((l) => !hasStarted(l, now)).map((l) => l.gameId))].slice(0, 20);
  const pollLive = legs.some((l) => hasStarted(l, now) && !isResolved(l) && now - gameStart(l).getTime() < LIVE_WINDOW_MS);
  const key = `${startedIds.join(",")}|${upcomingIds.join(",")}|${pollLive}`;

  useEffect(() => {
    if (!startedIds.length && !upcomingIds.length) return;
    let cancelled = false;
    const days = [...new Set(legs.filter((l) => startedIds.includes(l.gameId)).map((l) => localDateKey(gameStart(l))))];

    const load = async () => {
      const [dayResults, predictionResult] = await Promise.all([
        Promise.allSettled(days.map((day) => getGamesByDay(apiDateParam(day), userTimeZone()))),
        upcomingIds.length ? getPredictions(upcomingIds).catch(() => null) : null,
      ]);
      if (cancelled) return;
      const gamesById = Object.fromEntries(
        dayResults.flatMap((r) => (r.status === "fulfilled" ? r.value.data : [])).map((g) => [g.id, g])
      );
      const predictionsById = Object.fromEntries((predictionResult?.data ?? []).map((p) => [p.gameId, p]));
      mergeUpdates(gamesById, predictionsById);
    };

    load();
    const timer = pollLive ? setInterval(load, POLL_MS) : null;
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
    // the key captures every input that should trigger a refetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
};

const LegRow = ({ leg, locked, now, onRemove }) => {
  const pickedHome = leg.pickTeamId === leg.homeTeamId;
  const opponentId = pickedHome ? leg.awayTeamId : leg.homeTeamId;
  const pickCode = getTeamCode(leg.pickTeamId);
  const opponentCode = getTeamCode(opponentId);
  const result = legResult(leg, now);
  const showScore = leg.homeTeamScore != null && (result === "live" || result === "won" || result === "lost");

  return (
    <li className="flex items-center gap-3 py-2.5">
      <img src={getTeamLogoUrl(leg.pickTeamId)} alt="" loading="lazy" className="h-8 w-8 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-display font-bold">
          {pickCode} <span className="font-sans text-sm font-normal text-muted">{pickedHome ? "vs" : "at"} {opponentCode}</span>
        </div>
        <div className="truncate text-xs text-muted">
          {formatGameDate(leg)} · {formatGameTime(leg)}
          {showScore && <span className="ml-2 tabular-nums text-light-a0">{leg.homeTeamScore}–{leg.awayTeamScore}</span>}
        </div>
      </div>
      <span className="shrink-0 font-display text-sm font-bold tabular-nums">{leg.probability != null ? pct(leg.probability) : "–"}</span>
      <Chip chip={LEG_CHIP[result]} />
      {!locked && (
        <button type="button" onClick={onRemove} aria-label={`Remove ${pickCode}`} className="shrink-0 rounded p-1 text-muted hover:text-loss">
          <X className="h-4 w-4" />
        </button>
      )}
    </li>
  );
};

const SlipCard = ({ slip, active, now, actions }) => {
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(slip.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const expired = isExpired(slip, now);
  const started = firstStarted(slip, now);
  const probability = combinedProbability(slip);
  const legs = [...slip.legs].sort((a, b) => gameStart(a) - gameStart(b));

  const saveName = (event) => {
    event.preventDefault();
    actions.renameSlip(slip.id, name);
    setRenaming(false);
  };

  return (
    <section aria-label={slip.name} className={`rounded-xl border bg-surface-a0 p-3 sm:p-4 ${active && !expired ? "border-primary-a0/70" : "border-surface-a40"}`}>
      <div className="flex flex-wrap items-center gap-2">
        {renaming ? (
          <form onSubmit={saveName} className="flex min-w-0 flex-1 gap-2">
            <input
              id={`slip-name-${slip.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Slip name"
              autoFocus
              className="min-w-0 flex-1 rounded-md border border-surface-a40 bg-surface-a10 px-2 py-1 text-sm"
            />
            <button type="submit" className="rounded-md bg-primary-a0 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-dark-a0">Save</button>
          </form>
        ) : (
          <h2 className="min-w-0 flex-1 truncate font-display text-xl font-bold">{slip.name}</h2>
        )}
        {active && !expired && <span className="rounded-full bg-primary-a0 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-dark-a0">Active</span>}
        <Chip chip={SLIP_CHIP[slipResult(slip, now)]} />
      </div>

      {expired && started && (
        <p className="mt-2 text-xs font-semibold text-score">
          Expired · {getTeamCode(started.homeTeamId)}–{getTeamCode(started.awayTeamId)} tipped off {formatGameTime(started)}
        </p>
      )}

      {legs.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          No picks yet. Tap a team on a game card on the <Link to="/" className="text-primary-a10 underline">Home</Link> page.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-surface-a40">
          {legs.map((leg) => (
            <LegRow key={leg.gameId} leg={leg} locked={expired} now={now} onRemove={() => actions.removeLeg(slip.id, leg.gameId)} />
          ))}
        </ul>
      )}

      {legs.length > 0 && (
        <div className="mt-2 flex items-end justify-between gap-3 border-t border-surface-a40 pt-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">{legs.length}-leg parlay odds</div>
            <div className="scoreboard text-2xl font-bold">{probability != null ? `${(probability * 100).toFixed(1)}%` : "–"}</div>
          </div>
          {probability != null && probability > 0 && (
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">Fair price</div>
              <div className="font-display text-lg font-bold tabular-nums">{(1 / probability).toFixed(2)}</div>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider">
        {!active && !expired && (
          <button type="button" onClick={() => actions.setActive(slip.id)} className="rounded-md border border-primary-a0 px-3 py-1.5 text-primary-a10 hover:bg-surface-a10">Make active</button>
        )}
        {!renaming && (
          <button type="button" onClick={() => { setName(slip.name); setRenaming(true); }} className="rounded-md border border-surface-a40 px-3 py-1.5 hover:bg-surface-a10">Rename</button>
        )}
        {confirmDelete ? (
          <>
            <button type="button" onClick={() => actions.deleteSlip(slip.id)} className="rounded-md bg-loss px-3 py-1.5 text-dark-a0">Delete slip</button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-md border border-surface-a40 px-3 py-1.5 hover:bg-surface-a10">Keep</button>
          </>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className="rounded-md border border-surface-a40 px-3 py-1.5 text-muted hover:text-loss">Delete</button>
        )}
      </div>
    </section>
  );
};

const ParlaysPage = () => {
  const { slips, activeSlip, mergeUpdates, ...actions } = useParlays();
  const now = useNow(30 * 1000);
  useLegUpdates(slips, mergeUpdates, now);

  const ordered = [...slips].sort((a, b) =>
    a.id === activeSlip?.id ? -1 : b.id === activeSlip?.id ? 1 : b.createdAt - a.createdAt
  );

  return (
    <div className="flex flex-col gap-4 p-1 sm:p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Parlays</h1>
        <button
          type="button"
          onClick={() => actions.createSlip()}
          className="rounded-md bg-primary-a0 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-dark-a0 hover:bg-primary-a10"
        >
          New slip
        </button>
      </div>
      <p className="max-w-prose text-sm text-muted">
        Odds are the DunkMetrics model&apos;s win chances, not sportsbook lines. A slip locks once one of its games tips off, and keeps tracking results after that.
      </p>

      {slips.length === 0 ? (
        <div className="rounded-xl border border-surface-a40 bg-surface-a0 p-6 text-center">
          <p className="font-display text-lg font-bold">No slips yet</p>
          <p className="mt-1 text-sm text-muted">Pick a winner on any upcoming game and a slip is started for you.</p>
          <Link to="/" className="mt-4 inline-block rounded-md border border-primary-a0 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary-a10 hover:bg-surface-a10">
            Browse games
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {ordered.map((slip) => (
            <SlipCard key={slip.id} slip={slip} active={slip.id === activeSlip?.id} now={now} actions={actions} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParlaysPage;
