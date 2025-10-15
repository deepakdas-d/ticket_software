// src/hooks/useLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/userauthservice";
import { useAuth } from "../context/authcontext.jsx";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // from AuthProvider

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);

      // Save tokens in context + localStorage
      if (data.access && data.refresh) {
        login(data.access, data.refresh);
      }
     navigate("/profile", { replace: true });

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};


export default useLogin;
