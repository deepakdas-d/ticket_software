import { useState, useCallback } from "react";
import { fetchComplaints } from "../services/SupportTicketService";

export const useComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch complaints with pagination
  const fetchData = useCallback(async (page, perPage) => {
    setLoading(true);
    setError(null);
    try {
      const { complaints, totalRows } = await fetchComplaints(page, perPage);
      setComplaints(complaints);
      setTotalRows(totalRows);
    } catch (err) {
      // ✅ Preserve full error object, not just a string
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data by resetting and refetching
  const refresh = useCallback((page = 1, perPage = 10) => {
    fetchData(page, perPage);
  }, [fetchData]);

  return { complaints, totalRows, loading, error, fetchData, refresh };
};
