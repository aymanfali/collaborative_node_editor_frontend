import axios from "axios";

// Make sure Vite can read the env variable (Vite prefixes with VITE_)
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
