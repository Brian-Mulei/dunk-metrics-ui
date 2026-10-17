import React, { useEffect, useState } from 'react';
import { getStandings } from '../apis/apis';
import { useNavigate, useLocation } from "react-router-dom";
 import { getTeamLogoUrl } from '../utils/LogoPicker';
const StandingsTable = () => {
 

    const [standings, setStandings] = useState(null);
    const [viewMode, setViewMode] = useState('conference');
    const navigate = useNavigate();

    const [teamData, setTeamData] = useState([]);


    const [selectedConference, setSelectedConference] = useState('East');
    const [selectedDivision, setSelectedDivision] = useState('Atlantic');
  
    const fetchStandings = async () => {
      const response = await getStandings(); // Replace with actual API endpoint
       setStandings(response.data);
 
    };
  
    useEffect(() => {
      fetchStandings();
    }, []);

    const handleClick = (id) => {
      navigate(`/team/${id}`);
     };

  
    if (!standings) {
      return <div className="p-6 bg-surface-a0 rounded-lg shadow-lg">
      {/* Skeleton Table Header */}
      <div className="flex space-x-4 mb-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex-1 h-8 bg-surfaceTonal-a10 rounded animate-pulse"
          ></div>
        ))}
      </div>
    
      {/* Skeleton Table Rows */}
      <div className="space-y-2">
        {[...Array(5)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex space-x-4">
            {[...Array(5)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="flex-1 h-6 bg-surfaceTonal-a10 rounded animate-pulse"
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>;
    }

 

    const renderTeamList = (conference, isConferenceMode) => {
        // Flatten teams from all divisions in the conference
        const allTeams = Object.values(conference).flat();
        
        const sortedTeams = isConferenceMode 
            ? allTeams.sort((a, b) => a.conferenceRank - b.conferenceRank) 
            : allTeams.sort((a, b) => a.divisionRank - b.divisionRank);

        return sortedTeams.map((team, index) => (
            <tr   onClick={() => handleClick(team.teamId)}  key={team.teamName} className='cursor-pointer bg-surface-a0 text-white hover:text-surface-a0 hover:bg-primary-a0'>
                 <td className="p-2   text-center">
                    {isConferenceMode ? team.conferenceRank : team.divisionRank}
                </td>
                <td className="py-2 px-1 sm:px-4">
                        <img src={getTeamLogoUrl(team.teamId)} alt={team.teamName} loading="lazy" className="w-7 h-7 sm:w-8 sm:h-8" />
                       
                      </td>
                <td className="p-2  ">{team.teamName}</td>
                <td className="p-2 text-center whitespace-nowrap">{team.wins}-{team.losses}</td>               
            </tr>
        ));
    };


    return (
        < >
       <div className="sm:p-4 flex flex-col">
          <div className="pb-4">
            <div className="flex justify-center">
                 <button 
                     onClick={() => setViewMode('conference')} 
                     className={`px-3 sm:px-4 py-2 mr-2 rounded text-sm sm:text-base ${viewMode === 'conference' 
                         ? 'bg-primary-a0 text-dark-a0' 
                       : 'bg-gray-200 text-gray-800'}`}
                 >
                     Conference Rank
                 </button>
                 <button 
                      onClick={() => setViewMode('division')} 
                     className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${viewMode === 'division' 
                        ?  'bg-primary-a0 text-dark-a0' 
                         : 'bg-gray-200 text-gray-800'}`}
                >
                    Division Rank
                </button>
             </div>
             </div>
           
          {/* Table */}
          <div className="rounded-lg text-gray-900">
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                 {Object.entries(standings).map(([conference, divisions]) => (
                     <div key={conference} className="bg-surface-a0 shadow-lg rounded-lg overflow-hidden">
                         <h2 className="text-xl sm:text-2xl font-bold p-3 sm:p-4 text-primary-a0 bg-surface-a0">{conference} Conference</h2>
                         {viewMode === 'division' ? 
                         (     <div key={conference} className="bg-surface-a0 shadow-lg rounded-lg">
                                      {Object.entries(divisions).map(([division, teams]) => (
                                         <div key={division} className="mb-4">
                                             <h3 className="text-xl font-semibold p-2  bg-primary-a0 text-dark-a0">{division} Division</h3>
                                             <table className="w-full table-auto">
                                                 <thead>
                                                     <tr className="bg-surface-a0">
                                                     <th className="p-2 text-primary-a0">Rank</th>
                                                     <th className="p-2 text-primary-a0 "> </th>

                                                         <th className="p-2  text-primary-a0 justify-start">Team</th>
                                                         <th className="p-2  text-primary-a0">Record</th>
                                                     </tr>
                                                 </thead>
                                                 <tbody>
                                                     {renderTeamList(teams, viewMode === 'conference')}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                 </div>
                            
                         ) :
                          (
                            <table className="w-full table-auto">
                                 <thead>
                                     <tr className="bg-surface-a0">
                                     <th className="p-2 text-primary-a0">Rank</th>
                                     <th className="p-2 text-primary-a0"> </th>

                                         <th className="p-2  text-primary-a0 justify-start">Team</th>
                                         <th className="p-2 text-primary-a0 ">Record</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {renderTeamList(divisions, true)}
                                 </tbody>
                             </table>
                         )}
                     </div>
                 ))}
             </div> 
          </div>
        </div>
        </>  
    );
};

export default StandingsTable;
