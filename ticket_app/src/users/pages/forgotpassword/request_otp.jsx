import { useState } from "react";
import {
  requestPasswordReset,
  verifyOtp,
  updatePassword,
} from "../../services/userservices";
import "./requestotp.css"
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [passwordStep, setPasswordStep] = useState(false);
   const navigate = useNavigate();

  // STEP 1: Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await requestPasswordReset(email);
      setMessage("OTP sent ✅ Check your email.");
      setOtpStep(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await verifyOtp(email, otp);
      setMessage("OTP Verified ✅ You can now reset your password.");
      setPasswordStep(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Update Password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await updatePassword(email, newPassword, confirmPassword);
      setMessage("Password updated successfully ✅ Redirecting to login...");
      
      // ✅ Reset form state
      setOtpStep(false);
      setPasswordStep(false);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");

      // ✅ Redirect after short delay
      setTimeout(() => {
        navigate("/Login"); // change '/login' to your actual route
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>

      {/* STEP 1: Request OTP */}
      {!otpStep && (
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* STEP 2: Verify OTP */}
      {otpStep && !passwordStep && (
        <form onSubmit={handleOtpVerify}>
          <label>Enter OTP</label>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}

      {/* STEP 3: Update Password */}
      {passwordStep && (
        <form onSubmit={handlePasswordUpdate}>
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}

      {/* Messages */}
      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default ForgotPassword;
