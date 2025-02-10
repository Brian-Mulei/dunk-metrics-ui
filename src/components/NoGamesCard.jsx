import { Volleyball } from "lucide-react"; // Lucide-react for the icon

const NoGamesCard = () => {
  return (
    <div className="flex flex-col items-center justify-center   text-white rounded-2xl shadow-lg max-w-sm mx-auto">
      <Volleyball className="w-16 h-16 text-primary-a10" />
      <p className="mt-4 text-lg font-semibold">No games today</p>
    </div>
  );
};

export default NoGamesCard;
