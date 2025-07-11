import axios from "axios"

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/auth`,
  withCredentials: true,
});

export const registerUser = (data) => API.post("/register", data)

export const loginUser = (data) => API.post("/login", data)

export const logoutUser = () => API.post("/logout")

export const checkAuth = () => API.get("/check") 
