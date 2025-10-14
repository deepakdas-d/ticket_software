

  // export default Login;
  import { useState } from "react";
  import { Link } from "react-router-dom";
  import { useLogin } from "../../hooks/authhooks";
  import "./login.css";

  function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { handleLogin, loading, error } = useLogin();

    const clearForm = () => {
      setEmail("");
      setPassword("");
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const success = await handleLogin(email, password);
        if (success) {
          clearForm();
          // alert("Login successful ✅");
        }
      } catch (err) {
        alert(err.message || "Something went wrong ❌");
      }
    };

    return (
      <div className="login-container">

        {/* 🔹 App Header */}
        <header className="app-header">
          <div className="header-logo">
            <img src="https://www.techfifoinnovations.com/img/4.png" alt="TechFIFO Logo" className="logo-img" />
            <h1 className="header-title">TechFIFO Helpdesk</h1>
          </div>
          <p className="header-subtitle">Customer Support Portal</p>
        </header>

        <div className="login-wrapper">
          <div className="login-header">
            <h2 className="login-title">Login</h2>
          </div>

          <div className="login-card">
            <form onSubmit={handleSubmit}>
              <div className="error-container">
                {error && <div className="alert-box">{error}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
                <div className="forgot-password-link">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              </div>

              <div className="button-group">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>

          <div className="register-link">
            <p className="register-text">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
            <div className="ticket-link">
              {/* <p className="ticket-text">
                Want to raise a complaint without login?{" "}
                <Link to="/raise-ticket">Click here</Link>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default Login;
