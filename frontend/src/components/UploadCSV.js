import { useState } from "react";
import { uploadCSV } from "../api";

function UploadCSV({ setSummary, onUploadSuccess }) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const res = await uploadCSV(file, token);
      setSummary(res.data);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFile} />
      {loading && <p style={{ color: "blue" }}>Processing CSV...</p>}
    </div>
  );
}

export default UploadCSV;
