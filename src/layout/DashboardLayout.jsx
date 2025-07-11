import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authApi";
import { useState } from "react";
import { FiSun, FiMoon, FiMenu, FiX, FiLogOut, FiInfo, FiHome, FiList } from "react-icons/fi";

const DashboardLayout = () => {
  const { darkMode, toggleTheme, theme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/tasks", label: "My Tasks", icon: <FiList /> },
    { path: "/table", label: "Table", icon: <FiInfo /> },
  ];

  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? "dark" : "light"}`}>
      {/* Desktop Sidebar */}
<aside
  className="w-64 h-screen hidden md:flex flex-col shadow-md"
  style={{
    backgroundColor: theme.sidebar,
    borderRight: `1px solid ${theme.border}`,
    color: theme.text,
  }}
>
  {/* Title */}
  <div
    className="p-4 font-bold text-lg border-b"
    style={{ borderColor: theme.border }}
  >
    Task Manager
  </div>

  {/* Navigation Links */}
  <nav className="p-4 space-y-2 flex-1">
    {navItems.map((item) => (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className="flex items-center w-full text-left p-2 rounded transition-colors"
        style={{
          backgroundColor: "transparent",
          color: theme.text,
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        <span className="mr-3">{item.icon}</span>
        {item.label}
      </button>
    ))}
  </nav>

  {/* User Profile */}
  <div className="p-4 border-t" style={{ borderColor: theme.border }}>
    <div className="flex items-center space-x-3 mb-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
        style={{
          backgroundColor: theme.primary,
          color: "white",
        }}
      >
        {user?.name?.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="font-medium">{user?.name}</p>
        <p className="text-xs" style={{ color: theme.textSecondary || theme.text }}>
          {user?.email}
        </p>
      </div>
    </div>
    <button
      onClick={handleLogout}
      className="flex items-center w-full py-2 px-3 rounded text-sm transition-colors"
      style={{
        backgroundColor: theme.danger || "#ef4444",
        color: "white",
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.dangerHover || "#dc2626"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.danger || "#ef4444"}
    >
      <FiLogOut className="mr-2" />
      Logout
    </button>
  </div>
</aside>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded shadow"
        style={{
          backgroundColor: theme.primary,
          color: "white",
        }}
      >
        <FiMenu />
      </button>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div
            className="fixed top-0 left-0 h-full w-64 p-4 shadow-md flex flex-col"
            style={{ backgroundColor: theme.sidebar }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Task Manager</span>
              <button onClick={() => setMenuOpen(false)} className="p-1 text-lg" style={{ color: theme.text }}>
                <FiX />
              </button>
            </div>
            <nav className="space-y-2 flex-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left p-2 rounded transition-colors"
                  style={{
                    backgroundColor: "transparent",
                    color: theme.text,
                  }}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="border-t pt-4" style={{ borderColor: theme.border }}>
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{
                    backgroundColor: theme.primary,
                    color: "white",
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium" style={{ color: theme.text }}>
                    {user?.name}
                  </p>
                  <p className="text-xs" style={{ color: theme.textSecondary || theme.text }}>
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full py-2 px-3 rounded text-sm transition-colors"
                style={{
                  backgroundColor: theme.danger || "#ef4444",
                  color: "white",
                }}
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header
          className="flex justify-between items-center p-4 shadow-sm"
          style={{
            backgroundColor: theme.card,
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <h1 className="text-xl font-semibold" style={{ color: theme.text }}>
            Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center md:hidden"
                style={{
                  backgroundColor: theme.primary,
                  color: "white",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline" style={{ color: theme.text }}>
                {user?.name}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-1 rounded-full transition-colors"
              style={{
                color: theme.text,
              }}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center px-3 py-1 rounded text-sm transition-colors"
              style={{
                backgroundColor: theme.danger || "#ef4444",
                color: "white",
              }}
            >
              <FiLogOut className="mr-1" />
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ backgroundColor: theme.background }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
