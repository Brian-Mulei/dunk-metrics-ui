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

const PlayerComponent = ({ player, stats, onSelect }) => {
  const name = `${player.firstName} ${player.lastName}`;
  const clickable = Boolean(stats && onSelect);
  const Wrapper = clickable ? "button" : "div";

  return (
    <Wrapper
      {...(clickable ? { type: "button", onClick: () => onSelect(stats), "aria-label": `${name}: view stats` } : {})}
      className={`block w-full h-full text-left rounded-xl overflow-hidden bg-surface-a10 border border-surface-a40 ${clickable ? "transition-colors hover:border-primary-a0/70" : ""}`}
    >
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <PlayerHeadshot name={name} url={stats?.headshotUrl} className="w-14 h-14" />
          <div className="min-w-0 flex-1">
            <div className="font-bold text-lg text-light-a0 truncate">{name}</div>
            <div className="text-muted text-sm">
              #{player.number} · {positionMap[player.position] ?? player.position}
            </div>
          </div>
        </div>

        {!stats && <p className="mt-3 text-xs uppercase tracking-wider text-muted">No stats yet</p>}

        {stats && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center" data-testid="player-stats">
            <div className="rounded bg-surface-a0 py-1">
              <div className="text-xs text-muted">PTS</div>
              <div className="scoreboard text-lg font-bold">{formatStat(stats.points)}</div>
            </div>
            <div className="rounded bg-surface-a0 py-1">
              <div className="text-xs text-muted">TS%</div>
              <div className="scoreboard text-lg font-bold">{formatPct(stats.trueShootingPct)}</div>
            </div>
            <div className="rounded bg-surface-a0 py-1">
              <div className="text-xs text-muted">AST/TO</div>
              <div className="scoreboard text-lg font-bold">{formatStat(stats.assistToTurnover, 2)}</div>
            </div>
          </div>
        )}

        <div className="mt-3 text-sm text-light-a0 space-y-0.5">
          <p>
            <span className="text-muted">Nationality:</span> {player.nationality}
          </p>
          <p>
            <span className="text-muted">Height:</span> {player.heightUs} ({player.heightMetric})
          </p>
          <p>
            <span className="text-muted">Weight:</span> {player.weightUs} lbs ({player.weightMetric} kg)
          </p>
          <p>
            <span className="text-muted">Years Pro:</span> {player.yearsPro} · <span className="text-muted">Rookie:</span> {player.rookieYear}
          </p>
        </div>
      </div>
    </Wrapper>
  );
};

export default PlayerComponent;
