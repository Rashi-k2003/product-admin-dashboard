import api from "@/lib/axios";

export async function loginUser(username, password) {
  // DummyJSON's login endpoint
  const res = await api.post("/auth/login", { username, password });
  return res.data; // contains { token, id, username, ... }
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}