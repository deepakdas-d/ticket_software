import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../style/SignIn.css";

const SignIn = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear field error as user types
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await signIn(formData.username, formData.password);
    } catch (err) {
      setErrors({ general: err.message || "Failed to sign in" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="col-12 col-md-5 col-lg-4">
        <div className="card signin-card">
          <div className="card-body">
            <img
              src="https://www.techfifoinnovations.com/img/4.png"
              alt="TechFIFO Logo"
              className="logo-img"
              style={{ display: "block", margin: "0 auto 1.5rem", maxWidth: "150px" }}
            />
            <h2 className="card-title text-center">Admin Sign In</h2>

            {errors.general && (
              <div className="alert alert-danger">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="label">Username</label>
                <input
                  type="text"
                  className={`form-control ${errors.username ? "is-invalid" : ""}`}
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="label">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;