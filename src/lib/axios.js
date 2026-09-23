import axios from "axios";

// one shared instance used everywhere — this satisfies the
// "one shared axios setup file" rule
const api = axios.create({
  baseURL: "https://dummyjson.com",
});

// runs before every request: attach the saved token if we have one
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// runs after every response: central place to react to errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token missing/invalid/expired -> force back to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;