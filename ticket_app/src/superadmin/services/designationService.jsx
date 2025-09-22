export async function fetchDesignations() {
  try {
    const token = localStorage.getItem("accessToken"); // read token from storage
    if (!token) {
      throw new Error("No access token found");
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL; // Vite env variable

    const res = await fetch(`${API_BASE_URL}/supporters/designations/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // attach token
      },
    });

    // Handle errors with status code and message
    if (!res.ok) {
      let errorMsg = "";
      try {
        const data = await res.json();
        errorMsg = data.detail || JSON.stringify(data);
      } catch {
        errorMsg = await res.text(); // fallback to raw text
      }
      throw new Error(`Error ${res.status}: ${errorMsg}`);
    }

    // Parse JSON
    return await res.json();
  } catch (error) {
    console.error("Error fetching designations:", error);
    throw error;
  }
}
