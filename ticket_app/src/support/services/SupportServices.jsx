// src/services/SupportServices.js

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getSupporterProfile = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Fetching supporter profile with token:", token);

    const response = await fetch(`${API_BASE_URL}/supporters/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    });

    console.log("Raw response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fetch failed with status:", response.status, errorText);
      throw new Error("Failed to fetch profile");
    }

    const data = await response.json();
    console.log("Fetched profile data:", data);

    return data; 
  } catch (error) {
    console.error("Error fetching supporter profile:", error);
    throw error;
  }
};

//fetch designations for reassignment
export async function fetchDesignations() {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_BASE_URL}/supporters/designations/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      let errorMsg = "";
      try {
        const data = await res.json();
        errorMsg = data.detail || JSON.stringify(data);
      } catch {
        errorMsg = await res.text();
      }
      throw new Error(`Error ${res.status}: ${errorMsg}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching designations:", error);
    throw error;
  }
}

//fetch ticket Reports for analytics in dashboard/
export async function fetchTicketReports() {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_BASE_URL}/tickets/reports/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      let errorMsg = "";
      try {
        const data = await res.json();
        errorMsg = data.detail || JSON.stringify(data);
      } catch {
        errorMsg = await res.text();
      }
      throw new Error(`Error ${res.status}: ${errorMsg}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching ticket reports:", error);
    throw error;
  }
}