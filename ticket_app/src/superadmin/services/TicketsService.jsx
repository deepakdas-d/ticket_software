import { useState, useEffect } from "react";

const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [counts, setCounts] = useState({ total: 0, open: 0, in_progress: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      console.log("Fetching tickets...");
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");

        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_BASE_URL}/superadmin/complaints/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status);

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Expected JSON but received:", text);
          throw new Error("Invalid response from server (not JSON)");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch tickets");
        }

        const data = await response.json();
        console.log("Fetched tickets:", data);

        // Compute counts by status
        const statusCounts = data.reduce(
          (acc, ticket) => {
            acc.total += 1;
            if (ticket.status === "open") acc.open += 1;
            if (ticket.status === "in_progress") acc.in_progress += 1;
            if (ticket.status === "closed") acc.closed += 1;
            return acc;
          },
          { total: 0, open: 0, in_progress: 0, closed: 0 }
        );

        console.log("Ticket counts:", statusCounts);

        setTickets(data);
        setCounts(statusCounts);
      } catch (err) {
        console.error("Error fetching tickets:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("Fetching finished, loading set to false");
      }
    };

    fetchTickets();
  }, []);

  return { tickets, counts, loading, error };
};

export default useTickets;
