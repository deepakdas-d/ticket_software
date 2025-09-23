// src/hooks/useRegisterSupporter.js
import { useState } from "react";
import { registerSupporter } from "../services/supporterService";

export const useRegisterSupporter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const register = async (supporterData) => {
    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const data = await registerSupporter(supporterData);
      setSuccess(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
};
