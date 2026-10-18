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
        <div className="h-full bg-surface-a30 p-3 text-light-a0 overflow-y-auto no-scrollbar">
            {/* Pinned Teams Section */}
            {pinnedTeams.length > 0 && (
                <div className="mb-4">
                    <h2 className="font-display text-lg font-bold uppercase tracking-wider text-primary-a0 mt-2">Pinned Teams</h2>
                    <ul className="space-y-1 mt-1">
                        {pinnedTeams.map((team) => (
                            <li key={team.id} className="flex items-center space-x-2 cursor-pointer sidebar-team-item">
                                <Star className="w-4 h-4 text-primary-a0" onClick={() => togglePin(team)}></Star>
                                <img src={team.logoUrl} alt={team.name} loading="lazy" className="w-6 h-6" />
                                <span  onClick={() => handleClick(team.id)}>{team.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Regular Teams Section */}
            {Object.entries(teamsData).map(([conference, divisions]) => (
                <div key={conference} className="mb-4">
                    <h2 className="font-display text-lg font-bold uppercase tracking-wider text-primary-a0 mt-2">{conference}</h2>
                    {Object.entries(divisions).map(([division, teams]) => (
                        <div key={division} className="mt-2">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted px-3">{division}</h3>
                            <ul className="space-y-1 mt-1">
                                {teams.map((team) => (
                                    <li
                                        key={team.id}
                                        className="flex items-center space-x-2 cursor-pointer sidebar-team-item"

                                    >
                                        <Star
                                            className={`w-4 h-4 ${pinnedTeams.some((p) => p.id === team.id) ? "text-primary-a0" : "text-surface-a50 hover:text-primary-a0"}`}
                                            onClick={() => togglePin(team)}

                                        />
                                        <img src={team.logoUrl} alt={team.name} loading="lazy" className="w-6 h-6" />
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
