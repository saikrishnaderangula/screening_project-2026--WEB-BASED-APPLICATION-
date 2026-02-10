import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser(username, password);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "#121212" }}>
      <div className="card shadow-lg p-4" style={{ width: "360px", background: "#1e1e1e", color: "white", borderRadius: "10px" }}>
        <h4 className="text-center mb-4">Chemical Equipment Visualizer</h4>

        {error && <div className="alert alert-danger p-2">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            placeholder="Enter username"
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>

        <p className="text-center mt-3" style={{ fontSize: "12px", color: "#aaa" }}>
          Secure Equipment Analytics System
        </p>
      </div>
    </div>
  );
}

export default Login;
