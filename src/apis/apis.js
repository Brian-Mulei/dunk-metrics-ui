import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://vg4sk0404oookw084swk44ck.mulei.dev";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const cache = new Map();

// Several components ask for the same data (e.g. news in the sidebar and on the News page),
// so identical GETs share one in-flight request and reuse the result for `ttlMs`.
const cachedGet = (url, ttlMs, config) => {
  const key = `${url}?${JSON.stringify(config?.params ?? {})}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.time < ttlMs) {
    return hit.promise;
  }
  const promise = api.get(url, config).catch((error) => {
    cache.delete(key);
    throw error;
  });
  cache.set(key, { promise, time: Date.now() });
  return promise;
};

export const clearApiCache = () => cache.clear();

const MINUTE = 60 * 1000;

export const fetchStandings = async () => {
  try {
    const response = await cachedGet('/teams/conference/group', 60 * MINUTE);
    return response.data;
  } catch (error) {
    console.error('Error fetching standings:', error);
    throw error;
  }
};

export const getNews = async (size) => {
  return cachedGet('/news', 2 * MINUTE, { params: { size } });
};

export const getStandings = async () => {
  return cachedGet("/teams/standings", 5 * MINUTE);
};

export const getGamesByDay = async (date) => {
  return cachedGet('/game/get/date', 30 * 1000, { params: { date } });
}

export const getTeamDetails = async (teamId) => {
  return cachedGet('/teams/details', MINUTE, { params: { teamId } });
}

export const getStatsLeaderboard = async ({ sort = "points", teamId, minGames = 10, size = 50 } = {}) => {
  return cachedGet('/stats', 10 * MINUTE, { params: { sort, teamId, minGames, size } });
}

export const getTeamPlayerStats = async (teamId) => {
  return cachedGet('/stats/team', 10 * MINUTE, { params: { teamId } });
}
