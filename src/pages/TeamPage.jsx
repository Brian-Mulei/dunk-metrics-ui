import { useEffect, useMemo, useState } from "react";
import { useParams } from 'react-router-dom';
import MatchComponent from '../components/MatchComponent';
import PlayerComponent from '../components/PlayerComponent';
import PlayerModal from '../components/PlayerModal';
import TeamStatsPanel from '../components/TeamStatsPanel';
import GamePreviewModal from '../components/GamePreviewModal';
import { usePredictions } from '../utils/usePredictions';
import { byStartTime, gameStart } from '../utils/GameTime';
import { getTeamDetails, getTeamPlayerStats } from '../apis/apis';
import { getTeamLogoUrl } from '../utils/LogoPicker';

const TABS = [
  { key: "latest", label: "Latest" },
  { key: "players", label: "Players" },
  { key: "teamStats", label: "Team Stats", shortLabel: "Stats" },
  { key: "schedule", label: "Schedule" },
];

// older backends send 0 for teams that aren't ranked yet, newer ones null
const formatRank = (rank) => (rank ? `#${rank}` : "–");

// leftover "Scheduled" games from last season (unplayed playoff games) are in the data, so upcoming means not yet started
const STALE_AFTER_MS = 6 * 60 * 60 * 1000;

function TeamPage() {
  const { id } = useParams();

  const [teamData, setTeamData] = useState(null);
  const [playerStats, setPlayerStats] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("latest");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [preview, setPreview] = useState(null);
  // the games list covers every season we have; the schedule tab shows what's still to be played
  const upcomingGames = useMemo(
    () => (teamData?.next5Games ?? [])
      .filter((g) => g.status === "Scheduled" && gameStart(g).getTime() > Date.now() - STALE_AFTER_MS)
      .sort(byStartTime),
    [teamData]
  );
  const predictions = usePredictions(upcomingGames);

  useEffect(() => {
    let cancelled = false;
    setTeamData(null);
    setPlayerStats([]);
    setError(null);

    getTeamDetails(id)
      .then((response) => !cancelled && setTeamData(response.data))
      .catch((err) => !cancelled && setError(err?.response?.status === 404 ? "Team not found." : "Couldn't load this team."));

    // Stats are optional: the team page still works if the stats endpoint isn't deployed yet.
    getTeamPlayerStats(id)
      .then((response) => !cancelled && setPlayerStats(response.data.players ?? []))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [id]);

  const statsByPlayerId = useMemo(
    () => new Map(playerStats.filter((s) => s.playerId).map((s) => [s.playerId, s])),
    [playerStats]
  );

  if (error) {
    return <p className="rounded-lg bg-surface-a0 p-6 text-red-400">{error}</p>;
  }

  if (!teamData) {
    return (
      <div className="p-4 sm:p-6 bg-surface-a0 rounded-lg shadow-lg" data-testid="team-loading">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
          <div className="w-20 h-20 sm:w-32 sm:h-32 bg-surfaceTonal-a10 rounded-lg animate-pulse"></div>
          <div className="space-y-2">
            <div className="w-48 h-8 bg-surfaceTonal-a10 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
            <div className="w-24 h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
          <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-surface-a0 border border-surface-a40 rounded-xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 text-center sm:text-left">
        <img
          src={getTeamLogoUrl(teamData.teamId)}
          alt={`${teamData.name} logo`}
          className="w-20 h-20 sm:w-32 sm:h-32"
        />
        <div>
          <h1 className="font-display tracking-tight text-3xl sm:text-5xl font-bold">{teamData.name}</h1>
          <p className="text-muted">{teamData.city}</p>
          <div className="mt-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2 text-light-a0">
            <p><span className="text-muted">Record</span> <span className="scoreboard text-xl font-bold">{teamData.wins}-{teamData.losses}</span></p>
            <p><span className="text-muted">Conference</span> {teamData.conference} · {formatRank(teamData.conferenceRank)}</p>
            <p><span className="text-muted">Division</span> {teamData.division} · {formatRank(teamData.divisionRank)}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-4 border-b border-surface-a40">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              aria-label={tab.label}
              className={`py-2 px-0.5 sm:px-4 whitespace-nowrap font-semibold uppercase tracking-normal sm:tracking-wide text-[11px] min-[360px]:text-xs sm:text-sm ${activeTab === tab.key
                ? "border-b-2 border-primary-a0 text-primary-a0"
                : "text-muted hover:text-light-a0"
                }`}
            >
              {tab.shortLabel ? (
                <>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </>
              ) : tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "latest" && (
        <section>
          <h3 className="font-display tracking-tight text-2xl font-bold mb-2">Latest Games</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4">
            {teamData.last5Games.map((game) => (
              <MatchComponent key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {activeTab === "schedule" && (
        <section>
          <h3 className="font-display tracking-tight text-2xl font-bold mb-2">Upcoming games</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            {upcomingGames.length === 0 && <p className="text-muted">No upcoming games scheduled yet.</p>}
            {upcomingGames.map((game) => (
              <MatchComponent
                key={game.id}
                game={game}
                isLong={false}
                prediction={predictions[game.id]}
                onPreview={(g, prediction) => setPreview({ game: g, prediction })}
              />
            ))}
          </div>
        </section>
      )}

      {activeTab === "teamStats" && (
        <TeamStatsPanel teamId={id} onSelectPlayer={(stats) => setSelectedPlayer({ stats, bio: null })} />
      )}

      {activeTab === "players" && (
        <section>
          <h3 className="font-display tracking-tight text-2xl font-bold mb-4">Players</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
            {teamData.players.map((player) => (
              <PlayerComponent
                key={player.id}
                player={player}
                stats={statsByPlayerId.get(player.id)}
                onSelect={(stats) => setSelectedPlayer({ stats, bio: player })}
              />
            ))}
          </div>
        </section>
      )}

      {preview && (
        <GamePreviewModal game={preview.game} prediction={preview.prediction} onClose={() => setPreview(null)} />
      )}

      {selectedPlayer && (
        <PlayerModal
          espnPlayerId={selectedPlayer.stats.espnPlayerId}
          preview={selectedPlayer.stats}
          bio={selectedPlayer.bio}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}

export default TeamPage;
