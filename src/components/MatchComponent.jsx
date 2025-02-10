import React from 'react';
import { getTeamLogoUrl } from '../utils/LogoPicker';
import { getTeamCode } from '../utils/LogoPicker';
import { formatDate } from "../utils/DateFormater";
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const MatchComponent = ({ game, isLong = true }) => {
  const {
    id,
    date,
    homeTeamId,
    awayTeamId,
    homeTeam,
    awayTeam,
    venue,
    startingTime,
    status,
    homeTeamScore,
    awayTeamScore,
    lineScores,
  } = game;


 
  const homeLogoUrl = getTeamLogoUrl(homeTeamId);
  const awayLogoUrl = getTeamLogoUrl(awayTeamId);

  const homeLogoCode = getTeamCode(homeTeamId);
  const awayLogoCode = getTeamCode(awayTeamId);

  const isLive = status === "In Progress";
  const isFinished = status === "Finished";
  const isScheduled = status === "Scheduled";

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/team/${id}`);
       };


  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const homeStyle = homeTeamScore > awayTeamScore ? "text-primary-a0" : "text-white";
  const awayStyle = awayTeamScore > homeTeamScore ? "text-primary-a0" : "text-white";
  const tieStyle = homeTeamScore === awayTeamScore ? "text-white" : "";


  return (
    <div className="max-w-4xl mx-auto bg-surface-a10  shadow-lg rounded-lg overflow-hidden my-4 p-2 sm:p-4">
      {/* Game Header */}
      <div className="p-2 sm:p-4 border-b text-center text-white text-sm sm:text-base">
 
        {isLong && <span>{(`${date} at ${startingTime}`)} </span> } 
         {!isLong && <span>{(`${date}`)} </span>  }
        <span className="mx-1 sm:mx-2">•</span>
        <span>{venue}</span>
      </div>

      {/* Teams and Scores */}
      <div className="flex items-center justify-between p-2 sm:p-4 text-xs sm:text-lg">
        {/* Home Team */}
        <div className="flex items-center"   onClick={() => handleClick(homeTeamId)} >
          <img
            src={homeLogoUrl}
            alt={`${homeTeam} logo`}
            className="w-8 h-8 sm:w-12 sm:h-12 mr-2 sm:mr-4"
          />
          <span className="font-semibold text-primary-a20">
            {isSmallScreen || !isLong ? homeLogoCode : homeTeam}
          </span>
        </div>

        {/* Scores */}
        <div className="flex items-center">
          <span className={`text-2xl font-bold mx-4 ${tieStyle || homeStyle}`}>{homeTeamScore}</span>
          <span className="text-2xl font-bold mx-4">-</span>
          <span className={`text-2xl font-bold mx-4 ${tieStyle || awayStyle}`}>{awayTeamScore}</span>

        </div>

        {/* Away Team */}
        <div className="flex items-center"   onClick={() => handleClick(awayTeamId)}>
          <span className="font-semibold mr-2 sm:mr-4">
            {isSmallScreen || !isLong ? awayLogoCode : awayTeam}
          </span>
          <img
            src={awayLogoUrl}
            alt={`${awayTeam} logo`}
            className="w-8 h-8 sm:w-12 sm:h-12"
          />
        </div>
      </div>

      {isLong &&
        <div>
          {/* Line Scores */}
          <div className="p-4 border-t">
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 text-center items-center">
              <h3 className="font-semibold text-right">{homeLogoCode}</h3>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((q) => (
                  <div key={q} className="text-center">
                    <span className="block text-sm text-gray-600">Q{q}</span>
                    <span className="block font-bold">{lineScores.home.find(p => p.period === q)?.score || 0}</span>
                  </div>
                ))}
              </div>
              <div></div>

              <div></div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((q) => (
                  <div key={q} className="text-center">
                    <span className="block font-bold">{lineScores.visitors.find(p => p.period === q)?.score || 0}</span>
                  </div>
                ))}
              </div>
              <h3 className="font-semibold text-left">{awayLogoCode}</h3>
            </div>
          </div>

          {/* Game Status */}
          <div className="p-2 sm:p-4 bg-surface-a10 text-center text-xs sm:text-sm">
            {isLive && (
              <div className="flex items-center justify-center">
                <span className="text-red-600 font-bold">LIVE</span>
                <div className="w-2 h-2 bg-red-600 rounded-full ml-1 sm:ml-2 animate-pulse"></div>
              </div>
            )}
            {isFinished && <span className="text-white font-semibold">Final</span>}
            {isScheduled && <span className="text-white font-semibold">Scheduled</span>}
          </div>
        </div>
      }


    </div>
  );


};

export default MatchComponent;