import { useEffect, useState } from "react";
import { getPredictions } from "../apis/apis";
import { byStartTime, gameStart } from "./GameTime";

// win odds for the scheduled games in `games`, keyed by game id; failures just leave cards without odds
export const usePredictions = (games) => {
  const [predictions, setPredictions] = useState({});
  const scheduledIds = (games ?? [])
    .filter((g) => g.status === "Scheduled" && gameStart(g).getTime() > Date.now() - 6 * 60 * 60 * 1000)
    .sort(byStartTime)
    .slice(0, 20)
    .map((g) => g.id);
  const key = scheduledIds.join(",");

  useEffect(() => {
    if (!key) {
      setPredictions({});
      return;
    }
    let cancelled = false;
    getPredictions(key.split(",").map(Number))
      .then((response) => {
        if (!cancelled) setPredictions(Object.fromEntries(response.data.map((p) => [p.gameId, p])));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [key]);

  return predictions;
};
