import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { getTeamCode, getTeamLogoUrl } from "../utils/LogoPicker";
import { formatStat } from "../utils/StatFormatter";
import WinOddsBar from "./WinOddsBar";

const ordinal = (n) => {
  if (!n) return "";
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th");
  return `${n}${suffix}`;
};

const signed = (v) => (v === null || v === undefined ? "–" : `${v > 0 ? "+" : ""}${formatStat(v)}`);

const ROWS = [
  ["Record", (t) => `${t.wins}-${t.losses}`],
  ["Home", (t) => `${t.homeWins}-${t.homeLosses}`],
  ["Away", (t) => `${t.awayWins}-${t.awayLosses}`],
  ["Points per game", (t) => formatStat(t.pointsFor), (t) => t.pointsForRank],
  ["Allowed per game", (t) => formatStat(t.pointsAgainst), (t) => t.pointsAgainstRank],
  ["Point differential", (t) => signed(t.pointDiff), (t) => t.pointDiffRank],
  ["Last 10", (t) => (t.lastTen.length ? `${t.lastTen.filter((r) => r === "W").length}-${t.lastTen.filter((r) => r === "L").length}` : "–")],
  ["Streak", (t) => t.streak ?? "–"],
  ["Top scorer", (t) => {
    const leader = t.leaders.find((l) => l.key === "points");
    return leader ? `${leader.player.name} ${formatStat(leader.value)}` : "–";
  }],
];

const GamePreviewModal = ({ game, prediction, onClose }) => {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCloseRef.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const homeCode = getTeamCode(prediction.homeTeamId);
  const awayCode = getTeamCode(prediction.awayTeamId);
  const margin = prediction.projectedHomeMargin;
  const favourite = margin >= 0 ? homeCode : awayCode;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-preview-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-xl max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-surface-a40 bg-surface-a0 shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-surface-a40 p-4 sm:p-5">
          <div>
            <h2 id="game-preview-title" className="font-display tracking-tight text-2xl font-bold">
              {homeCode} vs {awayCode}
            </h2>
            <p className="text-sm text-muted">
              {game.date} · {game.startingTime?.slice(0, 5)} · {game.venue}
            </p>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close" className="rounded-md p-2 text-muted hover:bg-surface-a10 hover:text-light-a0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
            {[[prediction.homeTeamId, prediction.homeWinProbability, "Home"], null, [prediction.awayTeamId, prediction.awayWinProbability, "Away"]].map((side, i) =>
              side === null ? (
                <span key={i} className="text-muted">vs</span>
              ) : (
                <div key={i}>
                  <img src={getTeamLogoUrl(side[0])} alt="" className="mx-auto h-14 w-14" />
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted">{side[2]}</div>
                  <div className={`scoreboard text-4xl font-bold ${side[1] >= 0.5 ? "" : "opacity-50"}`}>{Math.round(side[1] * 100)}%</div>
                </div>
              )
            )}
          </div>

          <WinOddsBar prediction={prediction} />

          <p className="text-center text-sm">
            Projected: <span className="font-semibold text-primary-a0">{favourite} by {formatStat(Math.abs(margin))}</span>
          </p>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted">
                <th className="py-1 text-left font-medium">{prediction.home.seasonLabel} regular season</th>
                <th className="py-1 text-right font-medium">{homeCode}</th>
                <th className="py-1 text-right font-medium">{awayCode}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, value, rank]) => (
                <tr key={label} className="border-t border-surface-a40">
                  <td className="py-1.5 text-muted">{label}</td>
                  {[prediction.home, prediction.away].map((team, i) => (
                    <td key={i} className="py-1.5 text-right font-semibold tabular-nums">
                      {value(team)}
                      {rank && rank(team) ? <span className="ml-1 text-xs font-normal text-muted">{ordinal(rank(team))}</span> : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-xs text-muted">
            {prediction.basis} A DunkMetrics model, not betting odds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamePreviewModal;
