// The API sends game times in UTC; everything on screen is shown in the viewer's own timezone.

export const userTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

// older API responses only have the zone-less UTC date and time
export const gameStart = (game) =>
  new Date(game.startTimeUtc ?? `${game.date}T${game.startingTime ?? "00:00:00"}Z`);

export const formatGameDate = (game, timeZone) =>
  new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", timeZone }).format(gameStart(game));

export const formatGameTime = (game, timeZone) =>
  new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZone }).format(gameStart(game));

export const byStartTime = (a, b) => gameStart(a) - gameStart(b);

// "YYYY-MM-DD" for the viewer's calendar day (toISOString would give the UTC day)
export const localDateKey = (date = new Date()) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const formatDayHeading = (dateKey) => {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    .format(new Date(y, m - 1, d));
};

// the games API wants dd-MM-yyyy; split the string so no Date parsing can shift the day
export const apiDateParam = (dateKey) => {
  const [year, month, day] = dateKey.split("-");
  return `${day}-${month}-${year}`;
};
