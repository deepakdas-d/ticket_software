// src/hooks/useDesignations.js
import { useEffect, useState, useCallback } from "react";
import { fetchDesignations } from "../services/designationService";

export function useDesignations(show) {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ useCallback so function reference is stable
  const refreshDesignations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDesignations();
      setDesignations(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load designations");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when modal opens
  useEffect(() => {
    if (show) {
      refreshDesignations();
    }
  }, [show, refreshDesignations]);

  return { designations, loading, error, refreshDesignations };
}
