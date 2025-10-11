import { useState, useCallback, useEffect } from "react";
import { fetchComplaints } from "../services/SupportTicketService";

export const useComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (page, perPage) => {
    setLoading(true);
    setError(null);
    try {
      const { complaints, totalRows } = await fetchComplaints(page, perPage);
      setComplaints(complaints);
      setTotalRows(totalRows);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchData(1, 10);
  }, [fetchData]);

  const refresh = useCallback((page = 1, perPage = 10) => {
    fetchData(page, perPage);
  }, [fetchData]);

  return { complaints, totalRows, loading, error, fetchData, refresh };
};