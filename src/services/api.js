import axios from "axios";

// Make sure Vite can read the env variable (Vite prefixes with VITE_)
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach Authorization header from localStorage (for flows where tokens are stored client-side)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (_) {
    // ignore storage errors
  }
  return config;
});

// Use a separate axios instance to avoid interceptor recursion
const refreshClient = axios.create({ baseURL: BASE_URL, withCredentials: true });

// Response interceptor to refresh tokens on 401/403 and retry once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};
    const status = error?.response?.status;

    // Only try refresh for 401/403 from our API and if not already retried
    if ((status === 401 || status === 403) && !originalRequest._retry && originalRequest.baseURL === BASE_URL) {
      originalRequest._retry = true;
      try {
        // Try using cookie-stored refresh token (body empty), backend also accepts cookie
        const storedRefresh = (() => {
          try { return localStorage.getItem("refreshToken"); } catch { return null; }
        })();
        const payload = storedRefresh ? { refreshToken: storedRefresh } : {};
        const res = await refreshClient.post("/auth/refresh", payload);

        // If backend returns new tokens, optionally update localStorage for header-based auth
        const newAccess = res?.data?.data?.accessToken;
        const newRefresh = res?.data?.data?.refreshToken;
        try {
          if (newAccess) localStorage.setItem("accessToken", newAccess);
          if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
        } catch (_) { /* ignore */ }

        // Retry the original request with the same config
        return api(originalRequest);
      } catch (refreshErr) {
        // Optional: clean stored tokens on failure
        try {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        } catch (_) { /* ignore */ }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
