import React from 'react';
import { getTeamLogoUrl } from '../utils/LogoPicker';
import { getTeamCode } from '../utils/LogoPicker';
import { formatDate } from "../utils/DateFormater";
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

  const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/team/${id}`);
       };




  const showScores = !isScheduled;
  const homeStyle = isFinished && homeTeamScore < awayTeamScore ? "opacity-40" : "";
  const awayStyle = isFinished && awayTeamScore < homeTeamScore ? "opacity-40" : "";


  return (
    <div className="w-full bg-surface-a0 border border-surface-a40 rounded-xl overflow-hidden my-2 sm:my-3 transition-colors hover:border-primary-a0/60">
      {/* Game Header */}
      <div className="px-3 py-2 sm:px-4 border-b border-surface-a40 text-center text-muted text-xs sm:text-sm">
 
        {isLong && <span>{`${date} · ${startingTime?.slice(0, 5)}`}</span>}
         {!isLong && <span>{(`${date}`)} </span>  }
        <span className="mx-1 sm:mx-2">•</span>
        <span>{venue}</span>
      </div>

      {/* Teams and Scores */}
      <div className="flex items-center justify-between p-2 sm:p-4 text-xs sm:text-lg">
        {/* Home Team */}
        <div className="flex min-w-0 flex-1 items-center cursor-pointer" title={homeTeam} onClick={() => handleClick(homeTeamId)} >
          <img
            loading="lazy"
            src={homeLogoUrl}
            alt={`${homeTeam} logo`}
            className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 mr-2 sm:mr-4"
          />
          <span className="font-display text-lg sm:text-xl font-bold tracking-wide text-light-a0 truncate">
            {homeLogoCode}
          </span>
        </div>

        {/* Scores */}
        <div className="flex shrink-0 items-center">
          {showScores ? (
            <>
              <span className={`scoreboard text-3xl sm:text-4xl font-extrabold mx-2 sm:mx-4 ${homeStyle}`}>{homeTeamScore}</span>
              <span className="text-xl text-surface-a50 mx-1">–</span>
              <span className={`scoreboard text-3xl sm:text-4xl font-extrabold mx-2 sm:mx-4 ${awayStyle}`}>{awayTeamScore}</span>
            </>
          ) : (
            <span className="font-display text-xl sm:text-2xl font-bold text-muted mx-2 sm:mx-4">
              {startingTime?.slice(0, 5)}
            </span>
          )}

        </div>

        {/* Away Team */}
        <div className="flex min-w-0 flex-1 items-center justify-end cursor-pointer" title={awayTeam} onClick={() => handleClick(awayTeamId)}>
          <span className="font-display text-lg sm:text-xl font-bold tracking-wide mr-2 sm:mr-4 truncate">
            {awayLogoCode}
          </span>
          <img
            loading="lazy"
            src={awayLogoUrl}
            alt={`${awayTeam} logo`}
            className="w-8 h-8 sm:w-12 sm:h-12 shrink-0"
          />
        </div>
      </div>


      {isLong &&
        <div>
          {/* Line Scores */}

          {/* <div className="p-4 border-t">
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
          </div> */}

          {/* Game Status */}
          <div className="px-3 pb-3 text-center text-xs uppercase tracking-widest">
            {isLive && (
              <div className="flex items-center justify-center">
                <span className="text-loss font-bold">Live</span>
                <div className="w-2 h-2 bg-loss rounded-full ml-1 sm:ml-2 animate-pulse"></div>
              </div>
            )}
            {isFinished && <span className="text-muted font-semibold">Final</span>}
            {isScheduled && <span className="text-primary-a10 font-semibold">Scheduled</span>}
          </div>
        </div>
      }


    </div>
  );


};

export default MatchComponent;