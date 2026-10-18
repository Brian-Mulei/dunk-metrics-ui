import React from 'react';
 import MatchComponent from '../components/MatchComponent';
import { useState, useEffect } from 'react';
import { getGamesByDay } from '../apis/apis.js';
import NoGamesCard from '../components/NoGamesCard.jsx';
import GamePreviewModal from '../components/GamePreviewModal.jsx';
import { usePredictions } from '../utils/usePredictions';
const HomePage = () => {

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const [games, setGames] = useState(null);
      const [preview, setPreview] = useState(null);
      const predictions = usePredictions(games);
 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  
  useEffect(() => {
    fetchGames(formatDate(selectedDate.toString().split("T")[0]));
  }, [selectedDate]);

  const fetchGames = async (date) => {
    try {
      const response =  await getGamesByDay(date)
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
  <div className="w-full flex flex-wrap justify-end gap-2 mb-4">
    <input
      type="date"
      className="rounded-md border border-surface-a40 bg-surface-a0 px-3 py-2 text-light-a0"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
    />
    <button
      className="rounded-md bg-primary-a0 px-4 py-2 font-semibold uppercase tracking-wide text-dark-a0 hover:bg-primary-a10"
      onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
    >
      Today
    </button>
  </div>

  <h1 className="mb-2 flex flex-wrap items-baseline gap-x-3 font-display tracking-tight text-3xl sm:text-4xl font-bold">
    Games
    <span className="text-primary-a0 text-xl sm:text-2xl">{selectedDate}</span>
  </h1>

  <div className="w-full pb-4">
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-3 pb-4">
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
