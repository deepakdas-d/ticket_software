import { useState, useEffect } from "react";

const useTickets = () => {
  const [tickets, setTickets] = useState([]);
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch tickets");
        }

        const data = await response.json();
        console.log("Fetched tickets:", data);

        setTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return { tickets, loading, error };
};

export default useTickets;
