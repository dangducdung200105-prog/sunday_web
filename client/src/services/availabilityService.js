import api from "./api";

export const getCourtAvailability = async (courtId, date) => {
  const response = await api.get(`/availability/courts/${courtId}`, {
    params: {
      date,
    },
  });

  return response.data;
};
