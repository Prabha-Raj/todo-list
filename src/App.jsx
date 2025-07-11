import { useTheme } from "./context/ThemeContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { Register } from "./pages/Register";
import DashboardLayout from "./layout/DashboardLayout";
import ManageTasks from "./pages/ManageTasks";
import Table from "./pages/Table";

function App() {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-lightBg dark:bg-darkBg text-lightText dark:text-darkText">
        <Router>
          <Routes>
            {/* Default route */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<ManageTasks />} />
                <Route path="/table" element={<Table />} />
              </Route>
            </Route>
            
    
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;