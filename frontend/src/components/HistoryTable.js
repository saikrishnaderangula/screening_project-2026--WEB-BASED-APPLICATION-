import axios from "axios";
import { useEffect, useState } from "react";

function HistoryTable({ token, setHistoryData, refreshHistory }) {
  const [history, setHistory] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH HISTORY ----------------
  const fetchHistory = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get(
        "http://127.0.0.1:8000/api/history/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setHistory(res.data);
      if (setHistoryData) setHistoryData(res.data);
      setUpdated(true);
      setTimeout(() => setUpdated(false), 1500);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token, refreshHistory]);

  // ---------------- CLEAR HISTORY ----------------
  const handleClear = async () => {
    if (!token) return;

    if (!window.confirm("Are you sure you want to clear all history?")) return;

    try {
      await axios.delete(
        "http://127.0.0.1:8000/api/clear-history/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setHistory([]);
      if (setHistoryData) setHistoryData([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  // ---------------- EXPORT ----------------
  const handleExport = (type) => {
    window.open(
      `http://127.0.0.1:8000/api/export/${type}/`,
      "_blank"
    );
  };

  return (
    <div className="history-card">
      <div className="history-header">
        <h2>History</h2>

        <div className="history-actions">
          <button className="btn-danger-pro" onClick={handleClear}>
            🗑 Clear
          </button>

          <button
            className="btn-export"
            onClick={() => handleExport("csv")}
          >
            📄 CSV
          </button>

          <button
            className="btn-export"
            onClick={() => handleExport("json")}
          >
            📊 JSON
          </button>
        </div>
      </div>

      {updated && (
        <div className="update-indicator">
          ✓ History Updated
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading history...</p>
      ) : (
        <div className="table-container">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Total</th>
                <th>Flow</th>
                <th>Pressure</th>
                <th>Temp</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    No data available
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {new Date(
                        item.uploaded_at
                      ).toLocaleString()}
                    </td>
                    <td>{item.total_equipment}</td>
                    <td>{item.avg_flowrate}</td>
                    <td>{item.avg_pressure}</td>
                    <td>{item.avg_temperature}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoryTable;
