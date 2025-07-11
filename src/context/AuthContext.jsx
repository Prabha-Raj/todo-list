import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const token = localStorage.getItem("token");

  // Create a custom Axios instance with Authorization header
  const authAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/auth`,
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const checkAuth = async () => {
    try {
      const res = await authAxios.get("/check");

      const userData = res.data.user || { id: res.data.userId };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await authAxios.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
