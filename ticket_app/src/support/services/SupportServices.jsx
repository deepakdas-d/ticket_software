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

// ✅ Fetch ticket reports for analytics in dashboard (with debug logs)
export async function fetchTicketReports() {
  console.log("📡 [fetchTicketReports] Function called");

  try {
    const token = localStorage.getItem("accessToken");
    console.log("🔑 [fetchTicketReports] Token found:", !!token);

    if (!token) throw new Error("No access token found");

    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const url = `${API_BASE_URL}/tickets/reports/`;
    console.log("🌐 [fetchTicketReports] API URL:", url);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    console.log("📨 [fetchTicketReports] Request headers:", headers);

    console.time("⏱️ [fetchTicketReports] Request duration");
    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    console.timeEnd("⏱️ [fetchTicketReports] Request duration");

    console.log("📥 [fetchTicketReports] Response status:", res.status);

    if (!res.ok) {
      console.warn("⚠️ [fetchTicketReports] Non-OK response received");

      let errorMsg = "";
      try {
        const data = await res.json();
        console.warn("🚫 [fetchTicketReports] Error response JSON:", data);
        errorMsg = data.detail || JSON.stringify(data);
      } catch {
        errorMsg = await res.text();
        console.warn("🚫 [fetchTicketReports] Error response (text):", errorMsg);
      }

      throw new Error(`Error ${res.status}: ${errorMsg}`);
    }

    const data = await res.json();
    console.log("✅ [fetchTicketReports] Data received:", data);

    return data;
  } catch (error) {
    console.error("🔥 [fetchTicketReports] Error fetching ticket reports:", error);
    throw error;
  }
}
