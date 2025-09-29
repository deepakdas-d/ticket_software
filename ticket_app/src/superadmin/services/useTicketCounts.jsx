import { useState, useEffect } from "react";

const useTicketCounts = () => {
  const [counts, setCounts] = useState({ total: 0, in_progress: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");

        const API_BASE_URL = import.meta.env.VITE_API_URL;

        // total complaints count
        const overviewRes = await fetch(`${API_BASE_URL}/superadmin/complaints/overview/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const overview = await overviewRes.json();

        // in-progress complaints
        const inProgressRes = await fetch(`${API_BASE_URL}/superadmin/complaints/in-progress/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const inProgress = await inProgressRes.json();

        // closed complaints
        const closedRes = await fetch(`${API_BASE_URL}/superadmin/complaints/closed/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const closed = await closedRes.json();

        setCounts({
          total: overview.total || 0,
          in_progress: inProgress.count || 0,
          closed: closed.count || 0,
        });
      } catch (err) {
        console.error("Error fetching ticket counts:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return { counts, loading, error };
};

export default useTicketCounts;
