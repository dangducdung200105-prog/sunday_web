import api from "./api";

export const getMyPlayerProfile = async () => {
  const response = await api.get("/player-profiles/me");
  return response.data;
};

export const savePlayerProfile = async (profile, exists) => {
  const response = exists ? await api.put("/player-profiles/me", profile) : await api.post("/player-profiles", profile);
  return response.data;
};

export const getPlayerProfiles = async (params = {}) => {
  const response = await api.get("/match/players", {
    params,
  });

  return response.data;
};

export const swipePlayer = async (targetUserId, action) => {
  const response = await api.post("/match/swipe", {
    targetUserId,
    action,
  });

  return response.data;
};

export const getMyMatches = async () => {
  const response = await api.get("/match");

  return response.data;
};

export const unmatchPlayer = async (matchId) => {
  const response = await api.delete(`/match/${matchId}`);

  return response.data;
};
