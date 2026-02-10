import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import HistoryChart from "../components/HistoryChart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Reports() {
  const token = localStorage.getItem("token");
  const [history, setHistory] = useState([]);
  const reportRef = useRef();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/history/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error(err));
  }, [token]);

  const generateFullReport = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setFontSize(18);
    pdf.text("Chemical Equipment Analysis Report", 10, 15);
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 10, 22);

    pdf.addImage(imgData, "PNG", 10, 30, 190, 150);
    pdf.save("Full_Equipment_Report.pdf");
  };

  const latest = history.length > 0 ? history[history.length - 1] : null;

  const anomalies = () => {
    if (!latest || history.length < 2) return [];
    const previous = history.slice(0, -1);

    const avg = (arr, key) =>
      arr.reduce((sum, item) => sum + item[key], 0) / arr.length;

    let alerts = [];

    if (latest.avg_flowrate > avg(previous, "avg_flowrate") * 1.2)
      alerts.push("Flowrate unusually high");

    if (latest.avg_pressure > avg(previous, "avg_pressure") * 1.2)
      alerts.push("Pressure spike detected");

    if (latest.avg_temperature > avg(previous, "avg_temperature") * 1.2)
      alerts.push("Temperature overheating risk");

    return alerts;
  };

  return (
    <Layout>
      <div ref={reportRef}>
        <div className="card p-4 mb-4">
          <h4>📊 Executive Summary</h4>

          {latest ? (
            <>
              <p>Total Equipment: {latest.total_equipment}</p>
              <p>Avg Flowrate: {latest.avg_flowrate}</p>
              <p>Avg Pressure: {latest.avg_pressure}</p>
              <p>Avg Temperature: {latest.avg_temperature}</p>
            </>
          ) : (
            <p>No data available</p>
          )}
        </div>

        {anomalies().length > 0 && (
          <div className="alert alert-danger">
            <h5>⚠ Risk Analysis</h5>
            {anomalies().map((a, i) => (
              <p key={i}>{a}</p>
            ))}
          </div>
        )}

        <div className="card p-4">
          <h4>📈 Historical Performance Trend</h4>
          <HistoryChart history={history} />
        </div>
      </div>

      <button
        className="btn btn-primary mt-4"
        onClick={generateFullReport}
      >
        Generate Full PDF Report
      </button>
    </Layout>
  );
}

export default Reports;
