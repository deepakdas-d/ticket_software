import { useEffect, useState } from "react";
import { fetchDesignations } from "../services/designationService";

export function useDesignations(show) {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!show) return;

    setLoading(true);
    fetchDesignations()
      .then((data) => {
        setDesignations(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to load designations");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [show]);

  return { designations, loading, error };
}
