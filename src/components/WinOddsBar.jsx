import { getTeamCode } from "../utils/LogoPicker";

const pct = (p) => `${Math.round(p * 100)}%`;

const WinOddsBar = ({ prediction }) => {
  const home = prediction.homeWinProbability;
  const homeCode = getTeamCode(prediction.homeTeamId);
  const awayCode = getTeamCode(prediction.awayTeamId);
  const homeFavoured = home >= 0.5;

  return (
    <div aria-label={`Win odds: ${homeCode} ${pct(home)}, ${awayCode} ${pct(1 - home)}`}>
      <div className="flex justify-between text-xs font-semibold">
        <span className={homeFavoured ? "text-primary-a0" : "text-muted"}>{homeCode} {pct(home)}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted">Win odds</span>
        <span className={!homeFavoured ? "text-primary-a0" : "text-muted"}>{pct(1 - home)} {awayCode}</span>
      </div>
      <div className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-surface-a40">
        <div className={homeFavoured ? "bg-primary-a0" : "bg-surface-a50"} style={{ width: pct(home) }} />
        <div className={!homeFavoured ? "bg-primary-a0" : "bg-surface-a50"} style={{ width: pct(1 - home) }} />
      </div>
    </div>
  );
};

export default WinOddsBar;
