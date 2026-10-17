import { useState } from "react";
import { getInitials } from "../utils/StatFormatter";

const PlayerHeadshot = ({ name, url, className = "w-12 h-12" }) => {
  const [failed, setFailed] = useState(false);

  if (!url || failed) {
    return (
      <div
        className={`${className} shrink-0 rounded-full bg-surfaceTonal-a20 text-primary-a20 flex items-center justify-center font-bold`}
        aria-label={name}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} shrink-0 rounded-full bg-surfaceTonal-a10 object-cover object-top`}
    />
  );
};

export default PlayerHeadshot;
