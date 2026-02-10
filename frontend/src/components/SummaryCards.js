function SummaryCards({ data }) {
  if (!data) return null;

  return (
    <div>
      <h3>Total Equipment: {data.total_equipment}</h3>
      <h3>Avg Flowrate: {data.avg_flowrate}</h3>
      <h3>Avg Pressure: {data.avg_pressure}</h3>
      <h3>Avg Temperature: {data.avg_temperature}</h3>
    </div>
  );
}

export default SummaryCards;
