import { useState, useEffect } from "react";

const useUsers = () => {
  const [users, setUsers] = useState([]); // renamed from tickets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("Fetching users...");
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");

        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_BASE_URL}/superadmin/users/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch users");
        }

        const data = await response.json();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error }; // return 'users' instead of 'tickets'
};

export default useUsers;
