// import React, { useState } from "react";
// import { registerUser } from "../../services/userauthservice";
// import OtpVerification from "./OtpVerification";

// function RegisterForm() {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone_number: "",
//   });

//   const [isOtpStep, setIsOtpStep] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     setLoading(true);

//     try {
//       const result = await registerUser(formData);
//       console.log("Register response:", result);

//       if (result.success || result.message?.includes("OTP")) {
//         setIsOtpStep(true);
//       } else {
//         setError(result.message || "Registration failed");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (isOtpStep) {
//     return (
//       <OtpVerification
//         email={formData.email}
//         onSuccess={() => alert("Registration complete!")}
//       />
//     );
//   }

//   return (
//     <div className="register-form">
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={formData.username}
//           onChange={handleChange}
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//         />
//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Confirm Password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="phone_number"
//           placeholder="Phone Number"
//           value={formData.phone_number}
//           onChange={handleChange}
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Registering..." : "Register"}
//         </button>
//       </form>
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/userauthservice";
import { validateRegisterForm } from "./validateRegisterForm";
import SuccessPopup from "./successpopup";

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Prepare payload with correct field names for API
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone, // Map 'phone' to 'phone_number'
      };

      const result = await registerUser(payload);
      console.log("Register response:", result);

      if (result.message?.toLowerCase().includes("successful")) {
        setPopupMessage(result.message);
        setShowPopup(true);
      } else {
        // Handle backend errors
        const backendErrors = {};
        
        if (typeof result === "object") {
          for (const key in result) {
            if (Array.isArray(result[key])) {
              // Map backend field names back to form field names
              const formFieldName = key === "phone_number" ? "phone" : key;
              backendErrors[formFieldName] = result[key][0];
            } else if (typeof result[key] === "string") {
              // Handle simple string errors
              const formFieldName = key === "phone_number" ? "phone" : key;
              backendErrors[formFieldName] = result[key];
            }
          }
        }

        // If no specific field errors, show general error
        if (Object.keys(backendErrors).length === 0) {
          backendErrors.general = result.message || "Registration failed. Please try again.";
        }

        setErrors(backendErrors);
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle network or server errors
      if (err.response) {
        // Server responded with error status
        const errorData = err.response.data;
        const backendErrors = {};

        if (typeof errorData === "object") {
          for (const key in errorData) {
            if (Array.isArray(errorData[key])) {
              const formFieldName = key === "phone_number" ? "phone" : key;
              backendErrors[formFieldName] = errorData[key][0];
            } else if (typeof errorData[key] === "string") {
              const formFieldName = key === "phone_number" ? "phone" : key;
              backendErrors[formFieldName] = errorData[key];
            }
          }
        }

        if (Object.keys(backendErrors).length > 0) {
          setErrors(backendErrors);
        } else {
          setErrors({ general: errorData.message || "Registration failed. Please try again." });
        }
      } else if (err.request) {
        // Request made but no response
        setErrors({ general: "No response from server. Please check your connection." });
      } else {
        // Something else happened
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.username && <p className="error">{errors.username}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}

          {errors.general && <p className="error general">{errors.general}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      {showPopup && (
        <SuccessPopup message={popupMessage} onClose={handlePopupClose} />
      )}
    </>
  );
}

export default RegisterForm;