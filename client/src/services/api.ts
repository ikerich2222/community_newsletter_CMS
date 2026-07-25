import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post("/auth/register", { email, password, name }),
};

// Announcements API
export const announcementAPI = {
  getPublished: () => api.get("/announcements/published"),
  getAll: () => api.get("/announcements"),
  getOne: (id: string) => api.get(`/announcements/${id}`),
  create: (title: string, content: string, status = "draft") =>
    api.post("/announcements", { title, content, status }),
  update: (id: string, title: string, content: string, status: string) =>
    api.put(`/announcements/${id}`, { title, content, status }),
  delete: (id: string) => api.delete(`/announcements/${id}`),
};

export default api;
