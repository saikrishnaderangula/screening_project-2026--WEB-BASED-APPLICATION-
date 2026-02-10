import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const { darkMode, setDarkMode } = useTheme();
  const token = localStorage.getItem("token");

  const [sensitivity, setSensitivity] = useState(
    localStorage.getItem("alert_sensitivity") || 1.2
  );

  const [refreshInterval, setRefreshInterval] = useState(
    localStorage.getItem("auto_refresh") || 0
  );

  useEffect(() => {
    localStorage.setItem("alert_sensitivity", sensitivity);
  }, [sensitivity]);

  useEffect(() => {
    localStorage.setItem("auto_refresh", refreshInterval);
  }, [refreshInterval]);

  const clearAllData = () => {
    fetch("http://127.0.0.1:8000/api/clear-history/", {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    }).then(() => alert("All history cleared"));
  };

  return (
    <Layout>
      <div className="card p-4 mb-4">
        <h4>⚙ System Preferences</h4>

        <div className="mb-3">
          <label>Theme</label>
          <br />
          <button
            className="btn btn-outline-primary"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>

        <div className="mb-3">
          <label>Alert Sensitivity (Multiplier)</label>
          <input
            type="number"
            step="0.1"
            value={sensitivity}
            onChange={(e) => setSensitivity(e.target.value)}
            className="form-control"
          />
          <small>Default: 1.2 (20% deviation)</small>
        </div>

        <div className="mb-3">
          <label>Auto Refresh Interval (seconds)</label>
          <input
            type="number"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mt-4">
          <button
            className="btn btn-danger"
            onClick={clearAllData}
          >
            Clear All History Data
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
