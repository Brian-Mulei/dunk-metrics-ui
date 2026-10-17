import PlayerHeadshot from "./PlayerHeadshot";
import { formatPct, formatStat } from "../utils/StatFormatter";

const positionMap = {
  'F': "Forward",
  'G': "Guard",
  'C': "Center",
  'F-G': "Guard/Forward",
  'G-F': "Guard/Forward",
  'C-F': "Center/Forward",
  'F-C': "Forward/Center",
};

const PlayerComponent = ({ player, stats }) => {
  const name = `${player.firstName} ${player.lastName}`;

  return (
    <div className="h-full rounded-lg overflow-hidden shadow-lg bg-surface-a10 border border-surface-a30">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <PlayerHeadshot name={name} url={stats?.headshotUrl} className="w-14 h-14" />
          <div className="min-w-0 flex-1">
            <div className="font-bold text-lg text-primary-a20 truncate">{name}</div>
            <div className="text-gray-400 text-sm">
              #{player.number} · {positionMap[player.position] ?? player.position}
            </div>
          </div>
        </div>

        {stats && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center" data-testid="player-stats">
            <div className="rounded bg-surface-a0 py-1">
              <div className="text-xs text-gray-400">PTS</div>
              <div className="font-semibold text-white">{formatStat(stats.points)}</div>
            </div>
            <div className="rounded bg-surface-a0 py-1">
              <div className="text-xs text-gray-400">TS%</div>
              <div className="font-semibold text-white">{formatPct(stats.trueShootingPct)}</div>
            </div>
            <div className="rounded bg-surface-a0 py-1">
              <div className="text-xs text-gray-400">AST/TO</div>
              <div className="font-semibold text-white">{formatStat(stats.assistToTurnover, 2)}</div>
            </div>
          </div>
        )}

        <div className="mt-3 text-sm text-white space-y-0.5">
          <p>
            <span className="font-semibold">Nationality:</span> {player.nationality}
          </p>
          <p>
            <span className="font-semibold">Height:</span> {player.heightUs} ({player.heightMetric})
          </p>
          <p>
            <span className="font-semibold">Weight:</span> {player.weightUs} lbs ({player.weightMetric} kg)
          </p>
          <p>
            <span className="font-semibold">Years Pro:</span> {player.yearsPro} · <span className="font-semibold">Rookie:</span> {player.rookieYear}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerComponent;
