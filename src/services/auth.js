import api from "./api.js";

export const register = (data) => api.post("/auth/register", data);

export const login = (data) => api.post("/auth/login", data);

export const refreshToken = (refreshToken) =>
  api.post("/auth/refresh", refreshToken ? { refreshToken } : {});

export const logout = (refreshToken) =>
  api.post("/auth/logout", refreshToken ? { refreshToken } : {});

// ---------- Google OAuth ----------

export const googleLogin = () => {
  window.location.href = `${
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api/v1"
  }/auth/google`;
};
