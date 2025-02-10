
import React from "react";

const PlayerComponent = ({ player }) => {
  // Map position abbreviation to full word
  const positionMap = {
    'F': "Forward",
   'G': "Guard",
    'C': "Center",
    'F-G':"Guard/Forward",
    'G-F':"Guard/Forward",
  };

//   return (
//     <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200">
//       <div className="px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="font-bold text-xl text-gray-800">
//             {player.firstName} {player.lastName}
//           </div>
//           <div className="text-gray-600 text-sm">#{player.number}</div>
//         </div>
//         <div className="mt-2 text-gray-600">
//           <p>
//             <span className="font-semibold">Position:</span>{" "}
//             {positionMap[player.position]}
//           </p>
//           <p>
//             <span className="font-semibold">Nationality:</span>{" "}
//             {player.nationality}
//           </p>
//           <p>
//             <span className="font-semibold">Height:</span> {player.heightUs} (
//             {player.heightMetric})
//           </p>
//           <p>
//             <span className="font-semibold">Weight:</span> {player.weightUs} lbs (
//             {player.weightMetric} kg)
//           </p>
//           <p>
//             <span className="font-semibold">Years Pro:</span> {player.yearsPro}
//           </p>
//           <p>
//             <span className="font-semibold">Rookie Year:</span> {player.rookieYear}
//           </p>
//         </div>
//       </div>
//     </div>
//   );

return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-surface-a10  border border-gray-200 transform transition-transform duration-700 hover:rotate-x-15 -rotate-y-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl text-primary-a20">
            {player.firstName} {player.lastName}
          </div>
          <div className="text-gray-600 text-sm">#{player.number}</div>
        </div>
        <div className="mt-2 text-white">
          <p>
            <span className="font-semibold">Position:</span>{" "}
            {positionMap[player.position]}
          </p>
          <p>
            <span className="font-semibold">Nationality:</span>{" "}
            {player.nationality}
          </p>
          <p>
            <span className="font-semibold">Height:</span> {player.heightUs} (
            {player.heightMetric})
          </p>
          <p>
            <span className="font-semibold">Weight:</span> {player.weightUs} lbs (
            {player.weightMetric} kg)
          </p>
          <p>
            <span className="font-semibold">Years Pro:</span> {player.yearsPro}
          </p>
          <p>
            <span className="font-semibold">Rookie Year:</span> {player.rookieYear}
          </p>
        </div>
      </div>
    </div>
  );
};

// Sample player data
const player = {
  id: 322,
  firstName: "Kevon",
  lastName: "Looney",
  nationality: "USA",
  position: "F",
  number: 5,
  yearsPro: 6,
  rookieYear: 2015,
  weightMetric: 100.7,
  weightUs: 222,
  heightMetric: "2.06 Metres",
  heightUs: "6Ft 9 Inches",
};

 

 
export default PlayerComponent;
