import { teamsData } from "../assets/data/teams.jsx";
import { useNavigate, useLocation } from "react-router-dom";



import React, { useEffect, useState } from "react";
import { Star } from "lucide-react"; // Using lucide-react for the star icon

const TeamsSidebar =  ({ }) => {
    const [pinnedTeams, setPinnedTeams] = useState([]);
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/team/${id}`);
       };

    // Load pinned teams from localStorage
    useEffect(() => {
        const savedPinned = JSON.parse(localStorage.getItem("pinnedTeams") || "[]");
        setPinnedTeams(savedPinned);
    }, []);
 
    // Function to toggle pinned status
    const togglePin = (team) => {
        let updatedPinned;
        if (pinnedTeams.some((p) => p.id === team.id)) {
            updatedPinned = pinnedTeams.filter((p) => p.id !== team.id);
        } else {
                updatedPinned = [...pinnedTeams, team];
        }
        setPinnedTeams(updatedPinned);
        localStorage.setItem("pinnedTeams", JSON.stringify(updatedPinned));
    };
 
    return (
        <div className="h-[62rem] w-70 bg-[var(--clr-surface-a10)] p-4 text-white flex-1 overflow-y-auto no-scrollbar">
            {/* Pinned Teams Section */}
            {pinnedTeams.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold">Pinned Teams</h2>
                    <ul className="space-y-1 mt-1">
                        {pinnedTeams.map((team) => (
                            <li key={team.id} className="flex items-center space-x-2 cursor-pointer sidebar-team-item">
                                <Star className="w-4 h-4 text-primary-a0" onClick={() => togglePin(team)}></Star>
                                <img src={team.logoUrl} alt={team.name} className="w-6 h-6" />
                                <span  onClick={() => handleClick(team.id)}>{team.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Regular Teams Section */}
            {Object.entries(teamsData).map(([conference, divisions]) => (
                <div key={conference} className="mb-4">
                    <h2 className="text-lg font-bold">{conference}</h2>
                    {Object.entries(divisions).map(([division, teams]) => (
                        <div key={division} className="mt-2">
                            <h3 className="text-md font-semibold">{division}</h3>
                            <ul className="space-y-1 mt-1">
                                {teams.map((team) => (
                                    <li
                                        key={team.id}
                                        className="flex items-center space-x-2 cursor-pointer sidebar-team-item"

                                    >
                                        <Star
                                            className={`w-4 h-4 ${pinnedTeams.some((p) => p.id === team.id) ? "text-primary-a0" : "text-gray-500"}`}
                                            onClick={() => togglePin(team)}

                                        />
                                        <img src={team.logoUrl} alt={team.name} className="w-6 h-6" />
                                        <span  onClick={() => handleClick(team.id)}>{team.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TeamsSidebar;
