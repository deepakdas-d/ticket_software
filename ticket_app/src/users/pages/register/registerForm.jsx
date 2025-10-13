import { useState } from "react";
import { Link } from "react-router-dom";
import { validateRegisterForm } from "./validateRegisterForm";
import { registerUser } from "../../services/userauthservice";

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const clearForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await registerUser(formData);
      alert("Registration Successful!");
      clearForm();
    } catch (error) {
      alert("Registration Failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Register</h2>

      {/* Username */}
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className="error">{errors.username}</p>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Phone */}
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="text"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}
      </div>

      <button type="submit" className="register-button">
        Register
      </button>
       

      <div className="login_link">
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </form>
  );
}

export default RegisterForm;