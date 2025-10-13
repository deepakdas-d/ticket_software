import { useState, useEffect } from "react";

const useUsers = () => {
  const [users, setUsers] = useState([]); // renamed from tickets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("Starting fetchUsers...");

      try {
        const token = localStorage.getItem("accessToken");
        console.log("Access token:", token);

        if (!token) throw new Error("No access token found");

        const API_BASE_URL = import.meta.env.VITE_API_URL;
        console.log("API base URL:", API_BASE_URL);

        console.log("Sending request to:", `${API_BASE_URL}/superadmin/users/`);
        const response = await fetch(`${API_BASE_URL}/superadmin/users/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response data:", errorData);
          throw new Error(errorData.message || "Failed to fetch users");
        }

        const data = await response.json();
        console.log("Fetched users successfully:", data);

        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err.message);
        setError(err.message);
      } finally {
        console.log("Fetch users finished");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error }; // return 'users' instead of 'tickets'
};

export default useUsers;
