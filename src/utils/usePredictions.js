import { useEffect, useState } from "react";
import { getPredictions } from "../apis/apis";

// win odds for the scheduled games in `games`, keyed by game id; failures just leave cards without odds
export const usePredictions = (games) => {
  const [predictions, setPredictions] = useState({});
  const scheduledIds = (games ?? [])
    .filter((g) => g.status === "Scheduled")
    .sort((a, b) => a.date.localeCompare(b.date))
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
