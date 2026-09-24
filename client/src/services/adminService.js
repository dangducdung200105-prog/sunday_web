import api from "./api";

// ==================== DASHBOARD ====================

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};

// ==================== USERS ====================

export const getAllUsers = async (params = {}) => {
  const response = await api.get("/admin/users", { params });

  return response.data;
};

export const updateUserStatus = async (userId, isActive) => {
  const response = await api.patch(`/admin/users/${userId}/status`, {
    isActive,
  });

  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/admin/users/${userId}/role`, { role });

  return response.data;
};

// ==================== OWNERS ====================

export const getAllOwners = async () => {
  const response = await api.get("/admin/owners");

  return response.data;
};

// ==================== COURTS ====================

export const getAllCourtsAdmin = async (params = {}) => {
  const response = await api.get("/admin/courts", { params });

  return response.data;
};

export const approveCourt = async (courtId) => {
  const response = await api.patch(`/admin/courts/${courtId}/approve`);

  return response.data;
};

export const rejectCourt = async (courtId) => {
  const response = await api.patch(`/admin/courts/${courtId}/reject`);

  return response.data;
};

// ==================== BOOKINGS ====================

export const getAllBookingsAdmin = async (params = {}) => {
  const response = await api.get("/admin/bookings", { params });

  return response.data;
};

export const updateBookingStatusAdmin = async (bookingId, status) => {
  const response = await api.patch(`/admin/bookings/${bookingId}/status`, {
    status,
  });

  return response.data;
};
