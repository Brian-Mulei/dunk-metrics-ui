import React from 'react';
//import StandingsTable from './StandingsTable';

import { useState, useEffect } from "react";
import MatchComponent from '../components/MatchComponent';
import { useParams } from 'react-router-dom';
import { getTeamDetails } from '../apis/apis';
import { getTeamLogoUrl } from '../utils/LogoPicker';
import PlayerComponent from '../components/PlayerComponent';


const fetchTeamData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 17,
        name: "Los Angeles Lakers",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/220px-Los_Angeles_Lakers_logo.svg.png",
        stadium: "Crypto.com Arena",
        conference: "Western",
        division: "Pacific",
        conferenceRank: 3,
        divisionRank: 2,
        last5Games: [
          { date: "2023-10-25", opponent: "Golden State Warriors", result: "W 123-115" },
          { date: "2023-10-27", opponent: "Phoenix Suns", result: "L 110-120" },
          { date: "2023-10-29", opponent: "Memphis Grizzlies", result: "W 128-112" },
          { date: "2023-10-31", opponent: "Denver Nuggets", result: "L 105-110" },
          { date: "2023-11-02", opponent: "Houston Rockets", result: "W 118-102" },
        ],
        next5Games: [
          { date: "2023-11-05", opponent: "Oklahoma City Thunder", location: "Home" },
          { date: "2023-11-07", opponent: "Portland Trail Blazers", location: "Away" },
          { date: "2023-11-09", opponent: "Los Angeles Clippers", location: "Home" },
          { date: "2023-11-11", opponent: "Sacramento Kings", location: "Away" },
          { date: "2023-11-13", opponent: "Utah Jazz", location: "Home" },
        ],
        players: [
          { name: "LeBron James", position: "SF", number: 6 },
          { name: "Anthony Davis", position: "PF/C", number: 3 },
          { name: "D'Angelo Russell", position: "PG", number: 1 },
          { name: "Austin Reaves", position: "SG", number: 15 },
          { name: "Rui Hachimura", position: "PF", number: 28 },
        ],
      });
    }, 1000); // Simulate a 1.5-second delay
  });
};

function TeamPage() {

  const { id } = useParams();

  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("latest");

  const [height, setHeight] = useState('48rem'); // Default height for larger screens

  // Function to handle resizing
  const handleResize = () => {
    if (window.innerWidth < 640) {
      setHeight('36rem'); // Mobile view height
    } else {
      setHeight('48rem'); // Larger screens height
    }
  };



  useEffect(() => {
    const loadData = async () => {
      const data = await getTeamDetails(id);
      console.log(data.data)
      setTeamData(data.data);
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 bg-surface-a0 rounded-lg shadow-lg">
        {/* Skeleton Loader for Header */}
        <div className="flex items-start space-x-6 mb-6">
          <div className="w-32 h-32 bg-surfaceTonal-a10 rounded-lg animate-pulse"></div>
          <div className="space-y-2">
            <div className="w-48 h-8 bg-surfaceTonal-a10 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
            <div className="w-24 h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
            <div className="w-24 h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton Loader for Tabs */}
        <div className="flex space-x-4 mb-6">
          <div className="w-16 h-8 bg-surfaceTonal-a10 rounded animate-pulse"></div>
          <div className="w-16 h-8 bg-surfaceTonal-a10 rounded animate-pulse"></div>
        </div>

        {/* Skeleton Loader for Tab Content */}
        <div className="space-y-4">
          <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
          <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
          <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-surface-a0 rounded-lg shadow-lg">
      {/* Team Header */}
      <div className="flex items-start space-x-6 mb-6">
        <img
          src={getTeamLogoUrl(teamData.teamId)}
          alt={`${teamData.name} logo`}
          className="w-32 h-32"
        />
        <div>
          <h1 className="text-3xl font-bold text-primary-a0">{teamData.name}</h1>
          <p className="text-light-a0">{teamData.city} </p>
          <div className="mt-2">
          <p className="text-light-a0">
              <strong>Record:</strong> {teamData.wins} - {teamData.losses}
            </p> 
             {/* <p className="text-light-a0">
              <strong>Home:</strong> {teamData.homeRecord}
            </p>  <p className="text-light-a0">
              <strong>Away:</strong> {teamData.awayRecord}
            </p> */}
            <p className="text-light-a0">
              <strong>Conference:</strong> {teamData.conference} ({teamData.conferenceRank})
            </p>
            <p className="text-light-a0">
              <strong>Division:</strong> {teamData.division} ({teamData.divisionRank})
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-surfaceTonal-a20">
          <button
            onClick={() => setActiveTab("latest")}
            className={`py-2 px-4 ${activeTab === "latest"
                ? "border-b-2 border-primary-a0 text-primary-a0"
                : "text-light-a0"
              }`}
          >
            Latest
          </button>
          <button
            onClick={() => setActiveTab("players")}
            className={`py-2 px-4 ${activeTab === "players"
                ? "border-b-2 border-primary-a0 text-primary-a0"
                : "text-light-a0"
              }`}
          >
            Players
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`py-2 px-4 ${activeTab === "schedule"
                ? "border-b-2 border-primary-a0 text-primary-a0"
                : "text-light-a0"
              }`}
          >
            Schedule
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "latest" && (
           <div className="p-4 flex flex-col items-center h-[36rem] lg:h-[46rem] overflow-y-auto no-scrollbar">
            <h3 className="text-xl font-bold text-primary-a0 mb-4">Lastest Games</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4   flex-grow overflow-y-auto no-scrollbar">
              {teamData.last5Games.map((game) => (
                <div key={game.id} className="text-light-a0">

                  <MatchComponent game={game} />

                </div>
              ))}
            </div>

          </div>
 
      )}    {/* Tab Content */}
      {activeTab === "schedule" && (
        <div className="p-4 flex flex-col items-center  h-[36rem] lg:h-[46rem] overflow-y-auto no-scrollbar ">
          <div className="text-xl font-bold text-primary-a0 mb-4">Team Schedule</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 flex-grow overflow-y-auto no-scrollbar pb-8 ">
            {teamData.next5Games.map((game) => (
              <div key={game.id} className="text-light-a0">
                <MatchComponent game={game} isLong={false}/>
              </div>
            ))}
          </div>

          {/* <button className="text-primary-a0 hover:underline p-4">
            View Full Schedule →
          </button> */}
        </div>
      )}

      {activeTab === "players" && (
          <div className="p-4 flex flex-col items-center h-[36rem] lg:h-[46rem] overflow-y-auto no-scrollbar">
          <h3 className="text-xl font-bold text-primary-a0 mb-4">Players</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4   flex-grow overflow-y-auto no-scrollbar">
            {teamData.players.map((player) => (
              <div key={player.id} className="text-light-a0">

                <PlayerComponent player={player} />

              </div>
            ))}
          </div>

        </div>


        // <div>
        //   <h3 className="text-xl font-bold text-primary-a0 mb-4">Players</h3>
        //   <div className="space-y-2">
        //     {teamData.players.map((player, index) => (
        //       <div key={index} className="text-light-a0">
        //         <p>
        //           <strong>#{player.number}</strong> {player.firstName} {player.lastName} - {player.position}
        //         </p>
        //       </div>
        //     ))}
        //   </div>
        // </div>
      )}
    </div>

  );
}

export default TeamPage;
