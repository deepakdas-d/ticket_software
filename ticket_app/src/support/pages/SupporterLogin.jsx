import { useState } from "react";
import { useSupporterAuth } from "../hooks/useSupporterAuth";
import { useNavigate } from "react-router-dom";
import "../styles/SupporterLogin.css";

const SupporterLogin = () => {
  const { signInSupporter, loading } = useSupporterAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInSupporter(formData.username, formData.password);
      navigate("/supportdashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="supporter-login-container">
      <div className="login-card">
        <h2 className="card-title">Supporter Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupporterLogin;
