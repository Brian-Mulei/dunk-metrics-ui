import { useEffect, useState } from "react";
import { getAwards } from "../apis/apis";
import { getTeamLogoUrl } from "../utils/LogoPicker";
import { formatPct, formatStat } from "../utils/StatFormatter";
import PlayerHeadshot from "../components/PlayerHeadshot";
import PlayerModal from "../components/PlayerModal";
import SeasonSelect from "../components/SeasonSelect";

const SHOWN_BY_DEFAULT = 5;

const formatHighlight = (h) => (h.format === "pct" ? formatPct(h.value, 0) : formatStat(h.value));

const AwardRace = ({ race, onSelectPlayer }) => {
  const [expanded, setExpanded] = useState(false);
  const leaderScore = race.candidates[0]?.score ?? 0;
  const shown = expanded ? race.candidates : race.candidates.slice(0, SHOWN_BY_DEFAULT);

  return (
    <section className="rounded-xl border border-surface-a40 bg-surface-a0 p-4 sm:p-5" aria-labelledby={`race-${race.key}`}>
      <h2 id={`race-${race.key}`} className="font-display tracking-tight text-2xl sm:text-3xl font-bold">
        {race.name}
      </h2>
      <p className="mt-1 text-sm text-muted">{race.description}</p>

      {race.candidates.length === 0 ? (
        <p className="mt-4 text-muted">No eligible players yet.</p>
      ) : (
        <ol className="mt-4 space-y-2">
          {shown.map((c) => {
            const share = leaderScore > 0 ? Math.max(4, (c.score / leaderScore) * 100) : 0;
            const isLeader = c.rank === 1;
            return (
              <li key={c.player.espnPlayerId}>
                <button
                  type="button"
                  onClick={() => onSelectPlayer(c.player)}
                  className={`w-full rounded-lg p-2 sm:p-3 text-left transition-colors hover:bg-surface-a10 ${isLeader ? "bg-surface-a10 ring-1 ring-primary-a0/50" : ""}`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className={`w-5 sm:w-6 shrink-0 text-center font-display text-lg sm:text-xl font-bold ${isLeader ? "text-primary-a0" : "text-muted"}`}>
                      {c.rank}
                    </span>
                    <PlayerHeadshot name={c.player.name} url={c.player.headshotUrl} className={isLeader ? "w-11 h-11 sm:w-14 sm:h-14" : "w-9 h-9 sm:w-10 sm:h-10"} />
                    <div className="min-w-0 flex-1">
                      <div className={`truncate font-semibold ${isLeader ? "sm:text-lg" : ""}`}>{c.player.name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        {c.player.teamId && <img src={getTeamLogoUrl(c.player.teamId)} alt="" loading="lazy" className="w-4 h-4 shrink-0" />}
                        {c.player.teamCode}
                      </div>
                    </div>
                    <span className={`scoreboard shrink-0 font-bold ${isLeader ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`} title="Model score">
                      {race.key === "mip" && c.score > 0 ? "+" : ""}{formatStat(c.score)}
                    </span>
                  </div>
                  <div className="mt-2 pl-7 sm:pl-9">
                    <div className="h-1.5 rounded-full bg-surface-a40" aria-hidden="true">
                      <div className="h-full rounded-full bg-primary-a0" style={{ width: `${share}%` }} />
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
                      {c.highlights.map((h) => (
                        <span key={h.label} className="whitespace-nowrap">
                          <span className="text-light-a0 font-semibold">{formatHighlight(h)}</span> {h.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {race.candidates.length > SHOWN_BY_DEFAULT && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm font-semibold uppercase tracking-wide text-primary-a10 hover:text-primary-a0"
        >
          {expanded ? "Show top 5" : `Show top ${race.candidates.length}`}
        </button>
      )}
    </section>
  );
};

const AwardsPage = () => {
  const [awards, setAwards] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [season, setSeason] = useState("");

  useEffect(() => {
    let cancelled = false;
    setAwards(null);
    setError(null);
    getAwards(season || undefined)
      .then((response) => !cancelled && setAwards(response.data))
      .catch(() => !cancelled && setError("Couldn't load the award races."));
    return () => {
      cancelled = true;
    };
  }, [season]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display tracking-tight text-3xl sm:text-4xl font-bold">
          Award <span className="text-primary-a0">Watch</span>
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          {awards?.seasonLabel ? `${awards.seasonLabel} season. ` : ""}
          Ranked by a DunkMetrics model built on box-score stats, not betting odds or voter polls.
          {awards?.minGames ? ` Players need ${awards.minGames}+ games to qualify.` : ""}
        </p>
      </div>
      <SeasonSelect value={season} onChange={setSeason} />
      </div>

      {error && <p className="rounded-xl bg-surface-a0 p-4 text-loss">{error}</p>}

      {!awards && !error && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" data-testid="awards-loading">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 rounded-xl bg-surfaceTonal-a10 animate-pulse" />
          ))}
        </div>
      )}

      {awards && awards.races.length === 0 && (
        <p className="rounded-xl border border-dashed border-surface-a40 p-6 text-center text-muted">
          No player stats yet. Races appear after the first stats import.
        </p>
      )}

      {awards && awards.races.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {awards.races.map((race) => (
            <AwardRace key={race.key} race={race} onSelectPlayer={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <PlayerModal espnPlayerId={selected.espnPlayerId} preview={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default AwardsPage;
