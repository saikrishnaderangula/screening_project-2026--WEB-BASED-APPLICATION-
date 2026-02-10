  import { useState, useRef, useEffect } from "react";
  import UploadCSV from "../components/UploadCSV";
  import SummaryCards from "../components/SummaryCards";
  import HistoryTable from "../components/HistoryTable";
  import Charts from "../components/Charts";
  import HistoryChart from "../components/HistoryChart";
  import TypePieChart from "../components/TypePieChart";
  import Layout from "../components/Layout";
  import jsPDF from "jspdf";
  import html2canvas from "html2canvas";

  function Dashboard() {
    const token = localStorage.getItem("token");

    const [summary, setSummary] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [refreshHistory, setRefreshHistory] = useState(false);
    const [filter, setFilter] = useState("all");
    const reportRef = useRef();

    // ---------------- HANDLE UPLOAD ----------------
    const handleUpload = (data) => {
      setSummary(data);
      setRefreshHistory(prev => !prev);
    };

    // ---------------- FILTER LOGIC ----------------
    const filteredHistory = historyData.filter(item => {
      if (filter === "high_temp") return item.avg_temperature > 100;
      if (filter === "low_pressure") return item.avg_pressure < 6;
      return true;
    });

    // ---------------- CLEAR LOGIC ----------------
    useEffect(() => {
      if (historyData.length === 0) {
        setSummary(null);
      }
    }, [historyData]);

    // ---------------- PDF ----------------
    const generatePDF = async () => {
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFontSize(16);
      pdf.text("Chemical Equipment Analysis Report", 10, 10);
      pdf.addImage(imgData, "PNG", 10, 20, 190, 120);
      pdf.save("equipment_report.pdf");
    };

    return (
      <Layout>
        {/* Upload Section */}
        <div className="card p-3 shadow mb-4">
          <h5>Upload Dataset</h5>
          <UploadCSV setSummary={handleUpload} />
        </div>

        {/* Filter */}
        {historyData.length > 0 && (
          <div className="mb-4">
            <label><b>History Filter: </b></label>
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Uploads</option>
              <option value="high_temp">High Temperature</option>
              <option value="low_pressure">Low Pressure</option>
            </select>
          </div>
        )}

        <div ref={reportRef}>
          {/* Summary */}
          {summary && (
            <>
              <SummaryCards data={summary} />

              {/* Bar + Pie */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <Charts data={summary} />
                </div>

                <div className="col-md-6">
                  {summary.type_distribution && (
                    <TypePieChart typeData={summary.type_distribution} />
                  )}
                </div>
              </div>
            </>
          )}

          {/* Trend Chart */}
          {filteredHistory.length > 0 && (
            <div className="mt-5">
              <HistoryChart history={filteredHistory} />
            </div>
          )}
        </div>

        {/* PDF */}
        {summary && (
          <button
            className="btn btn-success mt-4"
            onClick={generatePDF}
          >
            Download PDF
          </button>
        )}

        {/* History Table */}
        <div className="card p-3 shadow mt-5">
          <HistoryTable
            token={token}
            setHistoryData={setHistoryData}
            refreshHistory={refreshHistory}
          />
        </div>
      </Layout>
    );
  }

  export default Dashboard;
