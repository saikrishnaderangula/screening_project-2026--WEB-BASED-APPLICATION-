import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useEffect } from "react";

function Layout({ children }) {
  const { darkMode, setDarkMode } = useTheme();

  // Apply theme class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  return (
    <div className="layout-wrapper d-flex">

      {/* SIDEBAR */}
      <div className="sidebar p-4">
        <h5 className="text-center mb-4">Visualizer</h5>
<NavLink to="/dashboard" className="nav-link">
  📊 Dashboard
</NavLink>

<NavLink to="/reports" className="nav-link">
  📄 Reports
</NavLink>

<NavLink to="/history" className="nav-link">
  🕒 History
</NavLink>

<NavLink to="/settings" className="nav-link">
  ⚙ Settings
</NavLink>

      </div>

      {/* MAIN CONTENT */}
      <div className="main-content flex-grow-1 p-4">

        <nav className="navbar d-flex justify-content-between align-items-center mb-4 px-3">
          <span className="navbar-brand fw-semibold">
            Chemical Equipment Dashboard
          </span>

          {/* THEME TOGGLE */}
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
