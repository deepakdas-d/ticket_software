import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../../services/userauthservice";
import "./otpverification.css"

function OtpVerification({ email }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await verifyOtp(email, otp);
      console.log("OTP verification response:", result);

      if (result.tokens && result.tokens.access) {
        // Save token in localStorage or context
        localStorage.setItem("accessToken", result.tokens.access);
        localStorage.setItem("refreshToken", result.tokens.refresh);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Navigate to profile page
        navigate("/profile");
      } else {
        setError(result.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP sent to {email}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default OtpVerification;
