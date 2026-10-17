const EMPTY = "–";

const isMissing = (value) => value === null || value === undefined || Number.isNaN(value);

export const formatStat = (value, digits = 1) =>
  isMissing(value) ? EMPTY : Number(value).toFixed(digits);

export const formatPct = (value, digits = 1) =>
  isMissing(value) ? EMPTY : `${Number(value).toFixed(digits)}%`;

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
