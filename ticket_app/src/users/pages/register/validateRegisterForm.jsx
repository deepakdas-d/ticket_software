export const validateRegisterForm = ({ username, email, password, confirmPassword, phone }) => {
  let errors = {};

  if (username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    errors.phone = "Phone number must be 10 digits.";
  }
  

  return errors;
};
