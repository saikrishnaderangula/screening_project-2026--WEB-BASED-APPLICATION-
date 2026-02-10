import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Layout({ children }) {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className="app-container">
      <div className="sidebar">
        <h5 className="mb-4">Visualizer</h5>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/history">History</Link>
        <Link to="/settings">Settings</Link>
      </div>

      <div className="main-content">
        <nav className="navbar d-flex justify-content-between">
          <span>Chemical Equipment Dashboard</span>

          <button
            className="btn btn-outline-primary"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </nav>

        {children}
      </div>
    </div>
  );
}

export default Layout;
