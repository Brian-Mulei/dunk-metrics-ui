import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStatsLeaderboard } from "../apis/apis";
import { teamsData } from "../assets/data/teams";
import { getTeamLogoUrl } from "../utils/LogoPicker";
import { formatPct, formatStat } from "../utils/StatFormatter";
import PlayerHeadshot from "../components/PlayerHeadshot";

const COLUMNS = [
  { key: "gamesPlayed", label: "GP", title: "Games played", format: (v) => formatStat(v, 0) },
  { key: "minutes", label: "MIN", title: "Minutes per game", format: formatStat },
  { key: "points", label: "PTS", title: "Points per game", format: formatStat },
  { key: "rebounds", label: "REB", title: "Rebounds per game", format: formatStat },
  { key: "assists", label: "AST", title: "Assists per game", format: formatStat },
  { key: "trueShootingPct", label: "TS%", title: "True shooting %", format: formatPct },
  { key: "effectiveFieldGoalPct", label: "eFG%", title: "Effective field goal %", format: formatPct },
  { key: "assistToTurnover", label: "AST/TO", title: "Assist to turnover ratio", format: (v) => formatStat(v, 2) },
  { key: "pointsPer36", label: "PTS/36", title: "Points per 36 minutes", format: formatStat },
  { key: "reboundsPer36", label: "REB/36", title: "Rebounds per 36 minutes", format: formatStat },
  { key: "assistsPer36", label: "AST/36", title: "Assists per 36 minutes", format: formatStat },
  { key: "threePointRate", label: "3PAr", title: "Share of shots that are threes", format: (v) => formatStat(v, 2) },
];

const MOBILE_COLUMNS = ["points", "trueShootingPct", "assistToTurnover", "pointsPer36"];

const allTeams = Object.values(teamsData)
  .flatMap((divisions) => Object.values(divisions).flat())
  .sort((a, b) => a.name.localeCompare(b.name));

const StatsPage = () => {
  const [sort, setSort] = useState("points");
  const [teamId, setTeamId] = useState("");
  const [minGames, setMinGames] = useState(10);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setError(null);
    getStatsLeaderboard({ sort, teamId: teamId || undefined, minGames, size: 50 })
      .then((response) => {
        if (!cancelled) setData(response.data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load player stats.");
      });
    return () => {
      cancelled = true;
    };
  }, [sort, teamId, minGames]);

  const sortColumn = COLUMNS.find((c) => c.key === sort);
  const players = data?.players ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-a0">Player Stats</h1>
          <p className="text-sm text-gray-400">
            {data?.seasonLabel ? `${data.seasonLabel} season · ` : ""}Source: ESPN, updated twice a day
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex flex-col text-xs text-gray-400">
            Team
            <select
              aria-label="Team"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="mt-1 rounded bg-surface-a10 p-2 text-sm text-white"
            >
              <option value="">All teams</option>
              {allTeams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs text-gray-400">
            Min games
            <select
              aria-label="Minimum games"
              value={minGames}
              onChange={(e) => setMinGames(Number(e.target.value))}
              className="mt-1 rounded bg-surface-a10 p-2 text-sm text-white"
            >
              {[0, 10, 25, 50].map((n) => (
                <option key={n} value={n}>{n}+</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs text-gray-400 md:hidden">
            Sort by
            <select
              aria-label="Sort by"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="mt-1 rounded bg-surface-a10 p-2 text-sm text-white"
            >
              {COLUMNS.map((c) => (
                <option key={c.key} value={c.key}>{c.title}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error && <p className="rounded bg-surface-a10 p-4 text-red-400">{error}</p>}

      {!data && !error && (
        <div className="space-y-2" data-testid="stats-loading">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 rounded bg-surfaceTonal-a10 animate-pulse" />
          ))}
        </div>
      )}

      {data && players.length === 0 && (
        <p className="rounded bg-surface-a10 p-4 text-gray-300">No player stats yet.</p>
      )}

      {players.length > 0 && (
        <>
          <ul className="space-y-2 md:hidden">
            {players.map((p, index) => (
              <li
                key={p.espnPlayerId}
                onClick={() => p.teamId && navigate(`/team/${p.teamId}`)}
                className="rounded-lg bg-surface-a10 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-right text-sm text-gray-400">{index + 1}</span>
                  <PlayerHeadshot name={p.name} url={p.headshotUrl} className="w-10 h-10" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-white">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.teamCode} · {p.position} · {p.gamesPlayed} GP</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-a0">{sortColumn.format(p[sort])}</div>
                    <div className="text-xs text-gray-400">{sortColumn.label}</div>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-1 text-center text-xs">
                  {MOBILE_COLUMNS.map((key) => {
                    const col = COLUMNS.find((c) => c.key === key);
                    return (
                      <div key={key} className="rounded bg-surface-a0 py-1">
                        <div className="text-gray-400">{col.label}</div>
                        <div className="text-white">{col.format(p[key])}</div>
                      </div>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-lg bg-surface-a0 md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-primary-a0">
                  <th className="sticky left-0 bg-surface-a0 p-2 text-left">#</th>
                  <th className="sticky left-8 bg-surface-a0 p-2 text-left">Player</th>
                  {COLUMNS.map((col) => (
                    <th key={col.key} className="p-2 text-right whitespace-nowrap">
                      <button
                        type="button"
                        title={col.title}
                        onClick={() => setSort(col.key)}
                        className={sort === col.key ? "text-white underline" : "hover:text-white"}
                      >
                        {col.label}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map((p, index) => (
                  <tr
                    key={p.espnPlayerId}
                    onClick={() => p.teamId && navigate(`/team/${p.teamId}`)}
                    className="cursor-pointer border-t border-surface-a20 text-white hover:bg-surface-a10"
                  >
                    <td className="sticky left-0 bg-surface-a0 p-2 text-gray-400">{index + 1}</td>
                    <td className="sticky left-8 bg-surface-a0 p-2">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <PlayerHeadshot name={p.name} url={p.headshotUrl} className="w-8 h-8" />
                        <span className="font-semibold">{p.name}</span>
                        {p.teamId && (
                          <img src={getTeamLogoUrl(p.teamId)} alt={p.teamCode} loading="lazy" className="w-5 h-5" />
                        )}
                      </div>
                    </td>
                    {COLUMNS.map((col) => (
                      <td
                        key={col.key}
                        className={`p-2 text-right tabular-nums ${sort === col.key ? "font-bold text-primary-a0" : ""}`}
                      >
                        {col.format(p[col.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsPage;
