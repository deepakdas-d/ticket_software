import { useState, useEffect } from "react";

const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      console.log("Fetching tickets..."); // Log when fetch starts
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");
        console.log("Using token:", token);
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        console.log("API_BASE_URL:", API_BASE_URL);
        const response = await fetch(`${API_BASE_URL}/superadmin/complaints/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status); // Log HTTP status

        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.json();
          console.error("Expected JSON but received:", text);
          throw new Error("Invalid response from server (not JSON)");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch tickets");
        }

        const data = await response.json();
        console.log("Fetched tickets:", data); // Log the fetched data
        setTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err.message); // Log error
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("Fetching finished, loading set to false"); // Log completion
      }
    };

    fetchTickets();
  }, []);

  return { tickets, loading, error };
};

export default useTickets;
