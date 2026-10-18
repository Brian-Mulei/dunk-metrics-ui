import { useEffect, useState } from "react";
import { getSeasons } from "../apis/apis";

// value "" means "latest season with games", which the backend picks by default
const SeasonSelect = ({ value, onChange, className = "" }) => {
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getSeasons()
      .then((response) => !cancelled && setSeasons(response.data.seasons ?? []))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (seasons.length < 2) return null;

  return (
    <label className={`flex flex-col text-xs text-muted ${className}`}>
      Season
      <select
        aria-label="Season"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 rounded-md border border-surface-a40 bg-surface-a0 p-2 text-sm text-light-a0"
      >
        {seasons.map((s, i) => (
          <option key={s.season} value={i === 0 ? "" : String(s.season)}>
            {s.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default SeasonSelect;
