import axios from 'axios';
 
export const fetchStandings = async () => {
  try {
    const response = await axios.get('https://vg4sk0404oookw084swk44ck.mulei.dev/teams/conference/group');
    return response.data;
  } catch (error) {
    console.error('Error fetching standings:', error);
    throw error;
  }
};



const API_BASE_URL = "http://https://vg4sk0404oookw084swk44ck.mulei.dev"; // Replace with your API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Example API calls
export const getNews = async (size) => {
  const response = await api.get(`/news?size=${size}`);
  return response;
};
export const getStandings = async () => {
  const response = await api.get("/teams/standings");
  return response;
};

 

export const getGamesByDay  = async (date)=>{
  const response = await api.get(`/game/get/date?date=${date}`);
  return response;
}

export const getTeamDetails  = async (teamId)=>{
  const response = await api.get(`/teams/details?teamId=${teamId}`);
  return response;
}

// Add more API functions as needed
