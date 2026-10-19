import { useEffect, useState } from "react";
import { getTeamStats } from "../apis/apis";
import { formatPct, formatStat } from "../utils/StatFormatter";
import PlayerHeadshot from "./PlayerHeadshot";
import SeasonSelect from "./SeasonSelect";

const ordinal = (n) => {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th");
  return `${n}${suffix}`;
};

const Card = ({ title, children }) => (
  <section className="rounded-xl border border-surface-a40 bg-surface-a10 p-4">
    <h3 className="mb-3 font-display text-lg font-bold uppercase tracking-wider text-primary-a0">{title}</h3>
    {children}
  </section>
);

const ScoringRow = ({ label, value, rank, teams, signed = false }) => (
  <div className="border-t border-surface-a40 py-2 first:border-t-0 first:pt-0">
    <div className="text-sm text-muted">{label}</div>
    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
      <span className="scoreboard text-2xl font-bold">
        {signed && value > 0 ? "+" : ""}{formatStat(value)}
      </span>
      {rank && <span className="whitespace-nowrap text-xs uppercase tracking-wider text-muted">{ordinal(rank)} of {teams}</span>}
    </div>
  </div>
);

const TeamStatsPanel = ({ teamId, onSelectPlayer }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [season, setSeason] = useState("");

  useEffect(() => {
    let cancelled = false;
    setStats(null);
    setError(null);
    getTeamStats(teamId, season || undefined)
      .then((response) => !cancelled && setStats(response.data))
      .catch(() => !cancelled && setError("Couldn't load team stats."));
    return () => {
      cancelled = true;
    };
  }, [teamId, season]);

  const picker = <SeasonSelect value={season} onChange={setSeason} className="w-40" />;

  if (error) return <p className="text-loss">{error}</p>;

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="team-stats-loading">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 rounded-xl bg-surfaceTonal-a10 animate-pulse" />
        ))}
      </div>
    );
  }

  if (stats.gamesPlayed === 0) {
    return (
      <div className="space-y-4">
        {picker}
        <p className="rounded-xl border border-dashed border-surface-a40 p-6 text-center text-muted">
          No regular-season games played yet{stats.seasonLabel ? ` in ${stats.seasonLabel}` : ""}. Team stats appear after the first game.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        {stats.seasonLabel && <p className="text-sm text-muted">{stats.seasonLabel} regular season · {stats.gamesPlayed} games</p>}
        {picker}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Record">
          <div className="flex items-end justify-between">
            <span className="scoreboard text-5xl font-extrabold">{stats.wins}-{stats.losses}</span>
            {stats.streak && (
              <span className={`rounded-md px-2 py-1 font-display text-lg font-bold ${stats.streak.startsWith("W") ? "bg-win/15 text-win" : "bg-loss/15 text-loss"}`}>
                {stats.streak}
              </span>
            )}
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-surface-a0 px-3 py-2">
              <dt className="text-xs uppercase tracking-wider text-muted">Home</dt>
              <dd className="font-semibold">{stats.homeWins}-{stats.homeLosses}</dd>
            </div>
            <div className="rounded-lg bg-surface-a0 px-3 py-2">
              <dt className="text-xs uppercase tracking-wider text-muted">Away</dt>
              <dd className="font-semibold">{stats.awayWins}-{stats.awayLosses}</dd>
            </div>
          </dl>
          <div className="mt-3">
            <div className="mb-1 text-xs uppercase tracking-wider text-muted">Last {stats.lastTen.length}, most recent first</div>
            <div className="flex gap-1" aria-label={`Last ${stats.lastTen.length} games: ${stats.lastTen.join(" ")}`}>
              {stats.lastTen.map((result, i) => (
                <span
                  key={i}
                  className={`flex h-7 w-7 items-center justify-center rounded text-xs font-bold ${result === "W" ? "bg-win/20 text-win" : "bg-loss/20 text-loss"}`}
                >
                  {result}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Scoring">
          <ScoringRow label="Points per game" value={stats.pointsFor} rank={stats.pointsForRank} teams={stats.teamsRanked} />
          <ScoringRow label="Allowed per game" value={stats.pointsAgainst} rank={stats.pointsAgainstRank} teams={stats.teamsRanked} />
          <ScoringRow label="Point differential" value={stats.pointDiff} rank={stats.pointDiffRank} teams={stats.teamsRanked} signed />
        </Card>

        <div className="md:col-span-2">
          <Card title="Team leaders">
            {stats.leaders.length === 0 ? (
              <p className="text-muted">No player stats for this team yet.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 min-[1700px]:grid-cols-3 gap-2">
                {stats.leaders.map((leader) => (
                  <li key={leader.key}>
                    <button
                      type="button"
                      onClick={() => onSelectPlayer?.(leader.player)}
                      className="flex w-full items-center gap-3 rounded-lg bg-surface-a0 p-2 text-left hover:bg-surfaceTonal-a10"
                    >
                      <PlayerHeadshot name={leader.player.name} url={leader.player.headshotUrl} className="w-10 h-10" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs uppercase tracking-wider text-muted">{leader.label}</span>
                        <span className="block truncate font-semibold">{leader.player.name}</span>
                      </span>
                      <span className="scoreboard text-xl font-bold">
                        {leader.format === "pct" ? formatPct(leader.value) : formatStat(leader.value)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamStatsPanel;
