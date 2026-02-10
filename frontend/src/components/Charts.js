import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Charts({ data }) {
  if (!data) return null;

  const chartData = {
    labels: ["Flowrate", "Pressure", "Temperature"],
    datasets: [
      {
        label: "Average Values",
        data: [
          data.avg_flowrate,
          data.avg_pressure,
          data.avg_temperature,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FF5722"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  return (
    <div style={{ width: "600px", marginTop: "30px" }}>
      <h2>Parameter Visualization</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default Charts;
