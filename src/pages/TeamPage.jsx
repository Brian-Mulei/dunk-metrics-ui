import { useEffect, useMemo, useState } from "react";
import { useParams } from 'react-router-dom';
import MatchComponent from '../components/MatchComponent';
import PlayerComponent from '../components/PlayerComponent';
import { getTeamDetails, getTeamPlayerStats } from '../apis/apis';
import { getTeamLogoUrl } from '../utils/LogoPicker';

const TABS = [
  { key: "latest", label: "Latest" },
  { key: "players", label: "Players" },
  { key: "schedule", label: "Schedule" },
];

function TeamPage() {
  const { id } = useParams();

  const [teamData, setTeamData] = useState(null);
  const [playerStats, setPlayerStats] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("latest");

  useEffect(() => {
    let cancelled = false;
    setTeamData(null);
    setPlayerStats([]);
    setError(null);

    getTeamDetails(id)
      .then((response) => !cancelled && setTeamData(response.data))
      .catch(() => !cancelled && setError("Couldn't load this team."));

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
    <div className="p-4 sm:p-6 bg-surface-a0 border border-surface-a40 rounded-xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 text-center sm:text-left">
        <img
          src={getTeamLogoUrl(teamData.teamId)}
          alt={`${teamData.name} logo`}
          className="w-20 h-20 sm:w-32 sm:h-32"
        />
        <div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-wide">{teamData.name}</h1>
          <p className="text-muted">{teamData.city}</p>
          <div className="mt-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2 text-light-a0">
            <p><span className="text-muted">Record</span> <span className="scoreboard text-xl font-bold">{teamData.wins}-{teamData.losses}</span></p>
            <p><span className="text-muted">Conference</span> {teamData.conference} · #{teamData.conferenceRank}</p>
            <p><span className="text-muted">Division</span> {teamData.division} · #{teamData.divisionRank}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 overflow-x-auto no-scrollbar">
        <div className="flex border-b border-surface-a40">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-4 whitespace-nowrap font-semibold uppercase tracking-wide text-sm ${activeTab === tab.key
                ? "border-b-2 border-primary-a0 text-primary-a0"
                : "text-muted hover:text-light-a0"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "latest" && (
        <section>
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide mb-2">Latest Games</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4">
            {teamData.last5Games.map((game) => (
              <MatchComponent key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {activeTab === "schedule" && (
        <section>
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide mb-2">Team Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            {teamData.next5Games.map((game) => (
              <MatchComponent key={game.id} game={game} isLong={false} />
            ))}
          </div>
        </section>
      )}

      {activeTab === "players" && (
        <section>
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide mb-4">Players</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
            {teamData.players.map((player) => (
              <PlayerComponent key={player.id} player={player} stats={statsByPlayerId.get(player.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default TeamPage;
