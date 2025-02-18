import React from 'react';
 import MatchComponent from '../components/MatchComponent';
import { useState, useEffect } from 'react';
import { getGamesByDay } from '../apis/apis.js';
import NoGamesCard from '../components/NoGamesCard.jsx';
const HomePage = () => {

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const [games, setGames] = useState(null);
 
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
    <div className="p-4 flex flex-col items-center h-screen">
  {/* Header section with date input and button */}
  <div className="w-full flex justify-end mb-4">
    <input
      type="date"
      className="border p-2 rounded-lg shadow-md bg-surface-a10 text-primary-a20"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
    />
    <button
      className="ml-2 bg-surface-a10 text-primary-a20 px-4 py-2 rounded-lg shadow-md"
      onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
    >
      Today
    </button>
  </div>

  {/* Title for the selected date */}
  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
    Showing games for 
    <div className="text-primary-a10 ml-2">{selectedDate}</div>
  </h3>

  {/* Scrollable grid container */}
  <div className="w-full flex-grow overflow-y-auto no-scrollbar pb-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 pb-4">
      {games.length === 0 && <NoGamesCard />}
      {games.map((game) => (
        <div key={game.id} className="text-light-a0">
          <MatchComponent game={game} />
        </div>
      ))}
    </div>
  </div>
</div>
 
  );
};

export default HomePage;
