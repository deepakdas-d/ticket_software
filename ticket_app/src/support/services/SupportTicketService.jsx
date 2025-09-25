const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchComplaints = async () => {

  try {
    const token = localStorage.getItem("accessToken");
    console.log("Fetching supporter profile with token:", token);

    const response = await fetch(`${API_BASE_URL}/tickets/supporter/complaints/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    console.log("Raw response:", response);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch complaints:", error);
    throw error;
  }
};