// services/designationService.js

export async function fetchDesignations() {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_BASE_URL}/supporters/designations/`, {
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

// POST service to add a new designation
export async function addDesignation(name) {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_BASE_URL}/supporters/designations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
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
    console.error("Error adding designation:", error);
    throw error;
  }
}

export default { fetchDesignations, addDesignation };