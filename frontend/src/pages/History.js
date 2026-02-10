import Layout from "../components/Layout";
import HistoryTable from "../components/HistoryTable";

function History() {
  const token = localStorage.getItem("token");

  return (
    <Layout>
      <div className="card p-4">
        <h4>🕒 Upload History Management</h4>
        <p>Review, filter, export and manage historical datasets.</p>
        <HistoryTable token={token} />
      </div>
    </Layout>
  );
}

export default History;
