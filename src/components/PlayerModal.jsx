import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { getPlayerDetail } from "../apis/apis";
import { getTeamLogoUrl } from "../utils/LogoPicker";
import { formatPct, formatStat } from "../utils/StatFormatter";
import PlayerHeadshot from "./PlayerHeadshot";

const madeAttempted = (made, attempted) =>
  made === undefined || made === null ? "–" : `${formatStat(made)}-${formatStat(attempted)}`;

const SECTIONS = [
  {
    title: "Per game",
    rows: [
      ["Games", (s) => formatStat(s.gamesPlayed, 0)],
      ["Minutes", (s) => formatStat(s.minutes)],
      ["Points", (s) => formatStat(s.points)],
      ["Rebounds", (s) => formatStat(s.rebounds)],
      ["Assists", (s) => formatStat(s.assists)],
      ["Steals", (s) => formatStat(s.steals)],
      ["Blocks", (s) => formatStat(s.blocks)],
      ["Turnovers", (s) => formatStat(s.turnovers)],
    ],
  },
  {
    title: "Shooting",
    rows: [
      ["Field goals", (s) => madeAttempted(s.fieldGoalsMade, s.fieldGoalsAttempted)],
      ["FG%", (s) => formatPct(s.fieldGoalPct)],
      ["Threes", (s) => madeAttempted(s.threePointersMade, s.threePointersAttempted)],
      ["3P%", (s) => formatPct(s.threePointPct)],
      ["Free throws", (s) => madeAttempted(s.freeThrowsMade, s.freeThrowsAttempted)],
      ["FT%", (s) => formatPct(s.freeThrowPct)],
      ["True shooting", (s) => formatPct(s.trueShootingPct)],
      ["Effective FG%", (s) => formatPct(s.effectiveFieldGoalPct)],
    ],
  },
  {
    title: "Advanced",
    rows: [
      ["Points per 36", (s) => formatStat(s.pointsPer36)],
      ["Rebounds per 36", (s) => formatStat(s.reboundsPer36)],
      ["Assists per 36", (s) => formatStat(s.assistsPer36)],
      ["Assist / turnover", (s) => formatStat(s.assistToTurnover, 2)],
      ["Free throw rate", (s) => formatStat(s.freeThrowRate, 2)],
      ["Three-point rate", (s) => formatStat(s.threePointRate, 2)],
    ],
  },
];

const PlayerModal = ({ espnPlayerId, preview, bio, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    let cancelled = false;
    getPlayerDetail(espnPlayerId)
      .then((response) => !cancelled && setDetail(response.data))
      .catch(() => !cancelled && setError("Couldn't load this player's stats."));
    return () => {
      cancelled = true;
    };
  }, [espnPlayerId]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCloseRef.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const current = detail?.current ?? preview;
  const previous = detail?.previous;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-surface-a40 bg-surface-a0 shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-surface-a40 bg-surface-a0 p-4 sm:p-5">
          <PlayerHeadshot name={current?.name ?? ""} url={current?.headshotUrl} className="w-16 h-16 sm:w-20 sm:h-20" />
          <div className="min-w-0 flex-1">
            <h2 id="player-modal-title" className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide truncate">
              {current?.name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted">
              {current?.teamId && <img src={getTeamLogoUrl(current.teamId)} alt="" className="w-5 h-5" />}
              <span>{current?.teamCode}</span>
              {current?.position && <span>· {current.position}</span>}
              {bio?.number !== undefined && <span>· #{bio.number}</span>}
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="self-start rounded-md p-2 text-muted hover:bg-surface-a10 hover:text-light-a0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-5">
          {error && <p className="text-loss">{error}</p>}

          {bio && (
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              {[
                ["Height", bio.heightUs],
                ["Weight", bio.weightUs ? `${bio.weightUs} lbs` : null],
                ["From", bio.nationality],
                ["Pro since", bio.rookieYear],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-surface-a10 px-3 py-2">
                  <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
                  <dd className="font-semibold">{value ?? "–"}</dd>
                </div>
              ))}
            </dl>
          )}

          {current ? (
            SECTIONS.map((section) => (
              <section key={section.title}>
                <h3 className="mb-2 font-display text-lg font-bold uppercase tracking-wider text-primary-a0">{section.title}</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-muted">
                      <th className="py-1 text-left font-medium"><span className="sr-only">Stat</span></th>
                      <th className="py-1 text-right font-medium">{detail?.currentSeasonLabel ?? "This season"}</th>
                      {previous && <th className="py-1 text-right font-medium">{detail.previousSeasonLabel}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map(([label, value]) => (
                      <tr key={label} className="border-t border-surface-a40">
                        <td className="py-1.5 text-muted">{label}</td>
                        <td className="py-1.5 text-right font-semibold tabular-nums">{value(current)}</td>
                        {previous && <td className="py-1.5 text-right tabular-nums text-muted">{value(previous)}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))
          ) : (
            !error && (
              <div className="space-y-2" data-testid="player-modal-loading">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 rounded bg-surfaceTonal-a10 animate-pulse" />
                ))}
              </div>
            )
          )}

          {current?.teamId && (
            <Link
              to={`/team/${current.teamId}`}
              onClick={onClose}
              className="inline-block rounded-md bg-primary-a0 px-4 py-2 font-semibold uppercase tracking-wide text-dark-a0 hover:bg-primary-a10"
            >
              View team
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
