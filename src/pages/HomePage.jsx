import React from 'react';
 import MatchComponent from '../components/MatchComponent';
import { useState, useEffect } from 'react';
import { getGamesByDay } from '../apis/apis.js';
import NoGamesCard from '../components/NoGamesCard.jsx';
import GamePreviewModal from '../components/GamePreviewModal.jsx';
import { usePredictions } from '../utils/usePredictions';
import { apiDateParam, formatDayHeading, localDateKey, userTimeZone } from '../utils/GameTime';
import GameCalendar, { dayInfo, useSeasonCalendar } from '../components/GameCalendar.jsx';
import { espnSeasonFor } from '../utils/SeasonCalendar';
const HomePage = () => {

      const [games, setGames] = useState(null);
      const [preview, setPreview] = useState(null);
      const predictions = usePredictions(games);
 
  const [selectedDate, setSelectedDate] = useState(localDateKey());
  const seasonCalendar = useSeasonCalendar(espnSeasonFor(selectedDate));
  const selectedDay = seasonCalendar
    ? dayInfo(selectedDate, seasonCalendar, new Map(seasonCalendar.days.map((d) => [d.date, d])))
    : null;
  
  useEffect(() => {
    fetchGames(apiDateParam(selectedDate));
  }, [selectedDate]);

  const fetchGames = async (date) => {
    try {
      const response =  await getGamesByDay(date, userTimeZone())
      setGames(response.data)
      } catch (error) {
     }
  };
  
  if (!games) {
    return (
      <div>
  <div className="p-6 bg-surface-a0 rounded-lg shadow-lg">
     

     <div className="flex space-x-4 mb-6">
      <div className="w-16 h-8 bg-surfaceTonal-a10 rounded animate-pulse"></div>
      <div className="w-16 h-8 bg-surfaceTonal-a10 rounded animate-pulse"></div>
    </div>

     <div className="space-y-4">
      <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
      <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
      <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
    </div>
  </div>

<br />
  <div className="p-6 bg-surface-a0 rounded-lg shadow-lg">
     

     <div className="flex space-x-4 mb-6">
      <div className="w-16 h-8 bg-surfaceTonal-a10 rounded animate-pulse"></div>
      <div className="w-16 h-8 bg-surfaceTonal-a10 rounded animate-pulse"></div>
    </div>

     <div className="space-y-4">
      <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
      <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
      <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
    </div>
  </div>

      </div>


      
    );
  }

  return (
    <div className="p-1 sm:p-4 flex flex-col">
  <div className="mb-4 flex w-full items-stretch justify-end gap-2">
    <div className="min-w-0 flex-1 sm:flex-none">
    <GameCalendar value={selectedDate} onChange={setSelectedDate} />
    </div>
    <button
      className="shrink-0 rounded-md bg-primary-a0 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-dark-a0 hover:bg-primary-a10 sm:px-4 sm:text-base"
      onClick={() => setSelectedDate(localDateKey())}
    >
      Today
    </button>
  </div>

  <h1 className="mb-2 flex flex-wrap items-baseline gap-x-3 font-display tracking-tight text-3xl sm:text-4xl font-bold">
    Games
    <span className="text-primary-a0 text-xl sm:text-2xl">{formatDayHeading(selectedDate)}</span>
  </h1>

  {selectedDay && (selectedDay.events.length > 0 || selectedDay.cupGames > 0 || selectedDay.preseason) && (
    <ul className="mb-2 flex flex-wrap gap-2" aria-label="On this day">
      {selectedDay.preseason && <li className="rounded-full bg-surface-a40 px-3 py-1 text-xs font-semibold">Preseason</li>}
      {selectedDay.cupGames > 0 && (
        <li className="rounded-full bg-score/15 px-3 py-1 text-xs font-semibold text-score">
          NBA Cup{selectedDay.cupStage ? ` · ${selectedDay.cupStage}` : ""}
        </li>
      )}
      {selectedDay.events.filter((e) => e.key !== "nbaCup").map((e) => (
        <li key={e.key} className="rounded-full bg-surface-a10 border border-surface-a40 px-3 py-1 text-xs font-semibold">{e.label}</li>
      ))}
    </ul>
  )}

  <div className="w-full pb-4">
    <div className="grid grid-cols-1 md:grid-cols-2 min-[1800px]:grid-cols-3 gap-x-3 pb-4">
      {games.length === 0 && <NoGamesCard />}
      {games.map((game) => (
        <div key={game.id} className="text-light-a0">
          <MatchComponent
            game={game}
            prediction={predictions[game.id]}
            onPreview={(g, prediction) => setPreview({ game: g, prediction })}
          />
        </div>
      ))}
    </div>
  </div>
  {preview && (
    <GamePreviewModal game={preview.game} prediction={preview.prediction} onClose={() => setPreview(null)} />
  )}
</div>
 
  );
};

export default HomePage;
