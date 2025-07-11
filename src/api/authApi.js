import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/auth`,
  withCredentials: true, 
});


const getToken = () => localStorage.getItem("token");

export const registerUser = (data) => API.post("/register", data);
export const loginUser    = (data) => API.post("/login",    data);

export const logoutUser = () => {
  const token = getToken();
  return API.post(
    "/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const checkAuth = () => {
  const token = getToken();
  return API.get("/check", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
