import { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

const lightTheme = {
  background: "#f7f9fb",
  text: "#1f2937",
  card: "#ffffff",
  primary: "#3b82f6",
  secondary: "#06b6d4",
  sidebar: "#ffffff",
  border: "#e5e7eb",
  hover: "#f3f4f6",
  danger: "#ef4444",
  dangerHover: "#dc2626",
  textSecondary: "#6b7280"
};

const darkTheme = {
  background: "#121212",
  text: "#f3f4f6",
  card: "#1e1e1e",
  primary: "#3b82f6",
  secondary: "#06b6d4",
  sidebar: "#1e1e1e",
  border: "#374151",
  hover: "#2d3748",
  danger: "#ef4444",
  dangerHover: "#dc2626",
  textSecondary: "#9ca3af"

};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedPreference = localStorage.getItem("darkMode");
    if (savedPreference !== null) return JSON.parse(savedPreference);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, theme }}>
      <div className={darkMode ? "dark" : "light"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};