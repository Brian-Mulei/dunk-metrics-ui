import { useCallback, useEffect, useState } from "react";
import * as parlays from "./parlays";

const CHANGE_EVENT = "parlays-change";

// every game card, the nav badge and the Parlays page hold their own copy, so writes are broadcast
export const useParlays = () => {
  const [state, setState] = useState(parlays.loadParlays);

  useEffect(() => {
    const reload = (event) => {
      if (event.type === "storage" && event.key !== parlays.STORAGE_KEY) return;
      setState(parlays.loadParlays());
    };
    window.addEventListener(CHANGE_EVENT, reload);
    window.addEventListener("storage", reload);
    return () => {
      window.removeEventListener(CHANGE_EVENT, reload);
      window.removeEventListener("storage", reload);
    };
  }, []);

  const apply = useCallback((update) => {
    const next = update(parlays.loadParlays());
    parlays.saveParlays(next);
    setState(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const activeSlip = parlays.activeSlipOf(state);
  // picks on an expired slip go into a fresh one, so the cards treat it as no slip at all
  const openSlip = activeSlip && !parlays.isExpired(activeSlip) ? activeSlip : null;

  return {
    slips: state.slips,
    activeSlip,
    openSlip,
    pickFor: (gameId) => openSlip?.legs.find((leg) => leg.gameId === gameId)?.pickTeamId ?? null,
    togglePick: (game, teamId, probability) => apply((s) => parlays.togglePick(s, game, teamId, probability)),
    removeLeg: (slipId, gameId) => apply((s) => parlays.removeLeg(s, slipId, gameId)),
    createSlip: (name) => apply((s) => parlays.createSlip(s, name)),
    renameSlip: (slipId, name) => apply((s) => parlays.renameSlip(s, slipId, name)),
    deleteSlip: (slipId) => apply((s) => parlays.deleteSlip(s, slipId)),
    setActive: (slipId) => apply((s) => parlays.setActiveSlip(s, slipId)),
    mergeUpdates: (gamesById, predictionsById) => apply((s) => parlays.mergeGameUpdates(s, gamesById, predictionsById)),
  };
};
