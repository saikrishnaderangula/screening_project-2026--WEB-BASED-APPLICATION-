import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function HistoryChart({ history }) {
  if (!history || history.length === 0) return null;

  const isDark = document.body.classList.contains("dark-theme");

  const labels = history.map((item) =>
    new Date(item.uploaded_at).toLocaleTimeString()
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Flowrate",
        data: history.map(i => i.avg_flowrate),
        borderColor: "#4CAF50",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Pressure",
        data: history.map(i => i.avg_pressure),
        borderColor: "#2196F3",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Temperature",
        data: history.map(i => i.avg_temperature),
        borderColor: "#FF9800",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#ffffff" : "#222222",
          font: { size: 13 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? "#fff" : "#000" },
        grid: { color: isDark ? "#444" : "#ddd" },
      },
      y: {
        ticks: { color: isDark ? "#fff" : "#000" },
        grid: { color: isDark ? "#444" : "#ddd" },
      },
    },
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h4 style={{ color: isDark ? "#fff" : "#000" }}>
        Upload Trend Over Time
      </h4>
      <Line data={data} options={options} />
    </div>
  );
}

export default HistoryChart;
