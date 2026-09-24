import api from "./api";

export const getCourts = async () => {
  const response = await api.get("/courts");

  return response.data;
};

export const getCourtById = async (courtId) => {
  const response = await api.get(`/courts/${courtId}`);

  return response.data;
};

export const getMyCourts = async () => {
  const response = await api.get("/courts/my-courts");

  return response.data;
};

export const createCourt = async (courtData) => {
  const response = await api.post("/courts", courtData);

  return response.data;
};

export const updateCourt = async (courtId, courtData) => {
  const response = await api.put(`/courts/${courtId}`, courtData);

  return response.data;
};

export const deleteCourt = async (courtId) => {
  const response = await api.delete(`/courts/${courtId}`);

  return response.data;
};
