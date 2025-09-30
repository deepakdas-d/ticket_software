import { useState, useEffect } from "react";

const useTicketCounts = () => {
  const [counts, setCounts] = useState({ total: 0, in_progress: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        console.log("🔄 Starting fetchCounts...");

        const token = localStorage.getItem("accessToken");
        console.log("📦 Retrieved token:", token);

        if (!token) throw new Error("No access token found");

        const API_BASE_URL = import.meta.env.VITE_API_URL;
        console.log("🌐 API Base URL:", API_BASE_URL);

        // total complaints
        console.log("➡️ Fetching overview complaints...");
        const overviewRes = await fetch(`${API_BASE_URL}/superadmin/complaints/overview/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Overview status:", overviewRes.status);
        const overview = await overviewRes.json();
        console.log("📊 Overview response:", overview);

        // in-progress complaints
        console.log("➡️ Fetching in-progress complaints...");
        const inProgressRes = await fetch(`${API_BASE_URL}/superadmin/complaints/in-progress/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ In-progress status:", inProgressRes.status);
        const inProgress = await inProgressRes.json();
        console.log("📊 In-progress response:", inProgress);

        // closed complaints
        console.log("➡️ Fetching closed complaints...");
        const closedRes = await fetch(`${API_BASE_URL}/superadmin/complaints/closed/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Closed status:", closedRes.status);
        const closed = await closedRes.json();
        console.log("📊 Closed response:", closed);

        const newCounts = {
          total: overview.total_complaints || 0, // ✅ using backend field
          in_progress: inProgress.count || 0,
          closed: closed.count || 0,
        };

        setCounts(newCounts);
        console.log("🎯 Final counts set:", newCounts);
      } catch (err) {
        console.error("❌ Error fetching ticket counts:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("⏹️ Fetch complete. Loading:", false);
      }
    };

    fetchCounts();
  }, []);

  return { counts, loading, error };
};

export default useTicketCounts;
