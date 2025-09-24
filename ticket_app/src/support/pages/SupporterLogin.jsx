import { useState } from "react";
import { useSupporterAuth } from "../hooks/useSupporterAuth";
import { useNavigate } from "react-router-dom";
import "../styles/SupporterLogin.css";

const SupporterLogin = () => {
  const { signInSupporter, loading } = useSupporterAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // clear specific field error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return; // stop if validation fails

    try {
      await signInSupporter(formData.username, formData.password);
      navigate("/supportdashboard");
    } catch (err) {
      setError(err.message || "Login failed");
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
              placeholder="Enter your username"
            />
            {formErrors.username && (
              <small className="field-error">{formErrors.username}</small>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {formErrors.password && (
              <small className="field-error">{formErrors.password}</small>
            )}
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
