import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.post("/auth/verify-email", {
    token,
  });

  return response.data;
};

export const resendVerificationEmail = async (email) => {
  const response = await api.post("/auth/resend-verification", {
    email,
  });

  return response.data;
};

export const forgotPassword = async (email, captchaToken) => {
  const response = await api.post("/auth/forgot-password", {
    email,
    captchaToken,
  });

  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
  });

  return response.data;
};
