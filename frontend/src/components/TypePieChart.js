import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

function TypePieChart({ typeData }) {
  if (!typeData) return null;

  const isDark = document.body.classList.contains("dark-theme");

  const labels = Object.keys(typeData);
  const values = Object.values(typeData);
  const total = values.reduce((a, b) => a + b, 0);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FF5722",
          "#FFC107",
          "#9C27B0",
          "#00BCD4",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: isDark ? "#ffffff" : "#222222",
          font: { size: 13 },
        },
      },
      datalabels: {
        color: "#fff",
        formatter: (value) =>
          ((value / total) * 100).toFixed(1) + "%",
      },
    },
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h4 style={{ color: isDark ? "#fff" : "#000" }}>
        Equipment Type Distribution
      </h4>
      <Pie data={data} options={options} />
    </div>
  );
}

export default TypePieChart;
