import api from "./api";

export const getCourts = async () => {
  const response = await api.get("/courts");

  return response.data;
};

export const getCourtById = async (courtId) => {
  const response = await api.get(`/courts/${courtId}`);

  return response.data;
};
