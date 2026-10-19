// ESPN keys seasons by end year: Oct 2026 - Jun 2027 is season 2027. Rolls over on 1 August, like the backend.
export const espnSeasonFor = (dateKey) => {
  const [year, month] = dateKey.split("-").map(Number);
  return month >= 8 ? year + 1 : year;
};

// date keys are "YYYY-MM-DD", so string comparison is date order
export const eventsOn = (dateKey, events = []) =>
  events.filter((e) => e.start <= dateKey && dateKey <= e.end);

const pad = (n) => String(n).padStart(2, "0");
export const dateKeyOf = (year, monthIndex, day) => `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

// 6 weeks x 7 days starting on Monday; days outside the month are null
export const monthGrid = (year, monthIndex) => {
  const first = new Date(year, monthIndex, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return Array.from({ length: 42 }, (_, i) => {
    const day = i - offset + 1;
    return day >= 1 && day <= daysInMonth ? dateKeyOf(year, monthIndex, day) : null;
  });
};

// marker styles shared by the calendar cells and the legend
export const MARKERS = {
  openingWeek: { label: "Opening week", swatch: "bg-primary-a0" },
  nbaCup: { label: "NBA Cup games", swatch: "bg-score" },
  tradeDeadline: { label: "Trade deadline", swatch: "bg-loss" },
  allStarBreak: { label: "All-Star break", swatch: "bg-allstar" },
  postseason: { label: "Play-in & playoffs", swatch: "bg-playoffs" },
  preseason: { label: "Preseason", swatch: "bg-surface-a50" },
};
