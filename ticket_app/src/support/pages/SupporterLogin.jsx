import { useState, useEffect } from "react";
import { useSupporterAuthContext } from "../context/SupporterAuthProvider";
import "../styles/SupporterLogin.css";

const SupporterLogin = () => {
  const quotes = [
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Don't watch the clock; do what it does. Keep going.",
    "Believe you can and you're halfway there.",
    "Dream big and dare to fail.",
  ];
  const { login } = useSupporterAuthContext();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const validate = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = "Username is required";
    else if (formData.username.length < 3)
      errors.username = "Username must be at least 3 characters";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData.username, formData.password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade out
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade(true); // fade in next quote
      }, 500); // half-second fade out
    }, 4000); // 4 seconds per quote
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="supporter-login-container">
      <h1 className="login-header fade-up">Techfifo Innovations</h1>

      <div className="login-card fade-up">
        <h2 className="card-title">Supporter Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group fade-up">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {formErrors.username && (
              <small className="field-error">{formErrors.username}</small>
            )}
          </div>
          <div className="form-group fade-up">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <small className="field-error">{formErrors.password}</small>
            )}
          </div>
          <button
            className="btn-login fade-up"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>

      <div className="quotes-card fade-up">
        <h3>Motivation</h3>
        <p className={`fade-quote ${fade ? "fade-in" : "fade-out"}`}>
          "{quotes[currentQuoteIndex]}"
        </p>
      </div>
    </div>
  );
};

export default SupporterLogin;
