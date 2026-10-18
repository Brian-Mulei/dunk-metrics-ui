import { CalendarX } from "lucide-react";

const NoGamesCard = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-a40 px-6 py-10 text-center">
      <CalendarX className="w-12 h-12 text-primary-a0" />
      <p className="mt-4 font-display text-2xl font-bold uppercase tracking-wide">No games on this date</p>
      <p className="mt-1 text-sm text-muted">Pick another date above to see scores and schedules.</p>
    </div>
  );
};

export default NoGamesCard;
