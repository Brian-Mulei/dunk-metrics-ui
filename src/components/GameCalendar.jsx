import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { getGameCalendar } from "../apis/apis";
import { userTimeZone, localDateKey, formatDayHeading } from "../utils/GameTime";
import { MARKERS, espnSeasonFor, eventsOn, monthGrid } from "../utils/SeasonCalendar";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const useSeasonCalendar = (season) => {
  const [calendar, setCalendar] = useState(null);
  useEffect(() => {
    let cancelled = false;
    getGameCalendar(season, userTimeZone())
      .then((response) => !cancelled && setCalendar(response.data))
      .catch(() => !cancelled && setCalendar({ days: [], events: [] }));
    return () => {
      cancelled = true;
    };
  }, [season]);
  return calendar;
};

const dayInfo = (dateKey, calendar, daysByDate) => {
  const day = daysByDate.get(dateKey);
  const events = eventsOn(dateKey, calendar?.events);
  const has = (key) => events.some((e) => e.key === key);
  const opening = calendar?.events.find((e) => e.key === "openingWeek");
  return {
    games: day?.games ?? 0,
    cupGames: day?.cupGames ?? 0,
    cupStage: day?.cupStage,
    events,
    openingWeek: has("openingWeek"),
    tradeDeadline: has("tradeDeadline"),
    allStarBreak: has("allStarBreak"),
    allStarGame: has("allStarGame"),
    cupFinal: has("cupFinal"),
    postseason: has("playIn") || has("playoffs"),
    preseason: Boolean(opening && dateKey < opening.start && day?.games),
  };
};

const describe = (dateKey, info) => {
  const parts = [formatDayHeading(dateKey), info.games ? `${info.games} game${info.games === 1 ? "" : "s"}` : "no games"];
  if (info.cupGames) parts.push(`${info.cupGames} NBA Cup${info.cupStage ? ` (${info.cupStage})` : ""}`);
  info.events.filter((e) => e.key !== "nbaCup").forEach((e) => parts.push(e.label));
  if (info.preseason) parts.push("Preseason");
  return parts.join(", ");
};

const DayCell = ({ dateKey, info, selected, today, onSelect }) => {
  const tint = info.allStarBreak
    ? "bg-allstar/15"
    : info.postseason
      ? "bg-playoffs/10"
      : info.openingWeek
        ? "bg-primary-a0/15"
        : "";
  return (
    <button
      type="button"
      onClick={() => onSelect(dateKey)}
      aria-label={describe(dateKey, info)}
      aria-pressed={selected}
      className={`relative flex h-12 sm:h-14 flex-col items-center justify-center rounded-lg text-sm transition-colors
        ${selected ? "bg-primary-a0 text-dark-a0 font-bold" : `${tint} hover:bg-surface-a40`}
        ${today && !selected ? "ring-1 ring-light-a0/60" : ""}
        ${info.tradeDeadline && !selected ? "ring-2 ring-loss" : ""}
        ${info.games || selected ? "" : "text-muted/60"}`}
    >
      {info.cupFinal && <Trophy className="absolute right-1 top-1 h-3 w-3 text-score" aria-hidden="true" />}
      <span>{Number(dateKey.slice(8))}</span>
      <span className="flex h-3 items-center gap-0.5" aria-hidden="true">
        {info.games > 0 && (
          <span className={`text-[10px] leading-none ${selected ? "text-dark-a0" : info.preseason ? "text-muted" : "text-light-a0/80"}`}>
            {info.games}
          </span>
        )}
        {info.cupGames > 0 && <span className={`h-1.5 w-1.5 rounded-full ${selected ? "bg-dark-a0" : "bg-score"}`} />}
        {info.preseason && !selected && <span className="h-1 w-1 rounded-full bg-surface-a50" />}
      </span>
    </button>
  );
};

const GameCalendar = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [viewed, setViewed] = useState(() => value.slice(0, 7));
  const panelRef = useRef(null);
  const [year, month] = viewed.split("-").map(Number);
  const calendar = useSeasonCalendar(espnSeasonFor(`${viewed}-01`));
  const daysByDate = useMemo(() => new Map((calendar?.days ?? []).map((d) => [d.date, d])), [calendar]);
  const today = localDateKey();

  useEffect(() => setViewed(value.slice(0, 7)), [value]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => panelRef.current && !panelRef.current.contains(e.target) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const shiftMonth = (delta) => {
    const d = new Date(year, month - 1 + delta, 1);
    setViewed(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
  const monthEvents = (calendar?.events ?? []).filter(
    (e) => e.key !== "nbaCup" && e.key !== "playoffs" && e.start.slice(0, 7) <= viewed && viewed <= e.end.slice(0, 7)
  );
  const selectedInfo = dayInfo(value, calendar, daysByDate);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center gap-2 rounded-md border border-surface-a40 bg-surface-a0 px-3 py-2 text-light-a0 hover:border-primary-a0"
      >
        <CalendarDays className="h-4 w-4 text-primary-a0" />
        <span>{formatDayHeading(value)}</span>
        {selectedInfo.cupGames > 0 && <span className="h-2 w-2 rounded-full bg-score" aria-hidden="true" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Pick a date"
          className="absolute right-0 z-40 mt-2 w-[min(22rem,calc(100vw-1.5rem))] rounded-xl border border-surface-a40 bg-surface-a0 p-3 shadow-2xl"
        >
          <div className="mb-2 flex items-center justify-between">
            <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month" className="rounded-md p-1.5 hover:bg-surface-a10">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="font-display text-lg font-bold">{monthLabel}</div>
              {calendar?.seasonLabel && <div className="text-xs text-muted">{calendar.seasonLabel} season</div>}
            </div>
            <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month" className="rounded-md p-1.5 hover:bg-surface-a10">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-muted">
            {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {monthGrid(year, month - 1).map((dateKey, i) =>
              dateKey ? (
                <DayCell
                  key={dateKey}
                  dateKey={dateKey}
                  info={dayInfo(dateKey, calendar, daysByDate)}
                  selected={dateKey === value}
                  today={dateKey === today}
                  onSelect={(d) => {
                    onChange(d);
                    setOpen(false);
                  }}
                />
              ) : (
                <div key={`blank-${i}`} />
              )
            )}
          </div>

          {monthEvents.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-surface-a40 pt-2 text-sm">
              {monthEvents.map((e) => (
                <li key={e.key} className="flex justify-between gap-2">
                  <span>{e.label}</span>
                  <span className="text-muted">
                    {formatShort(e.start)}{e.end !== e.start ? ` – ${formatShort(e.end)}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-surface-a40 pt-2 text-xs text-muted" aria-label="Legend">
            {Object.entries(MARKERS).map(([key, m]) => (
              <li key={key} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${m.swatch}`} aria-hidden="true" />
                {m.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const formatShort = (dateKey) => {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(y, m - 1, d));
};

export { dayInfo, useSeasonCalendar };
export default GameCalendar;
