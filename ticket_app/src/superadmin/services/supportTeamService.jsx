// src/superadmin/services/supporterService.js
 export async function fetchSupporters() {
  try {
    console.log("Fetching supporters...");

    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");
    console.log("Using token:", token);

    const API_BASE_URL = import.meta.env.VITE_API_URL;
    console.log("API_BASE_URL:", API_BASE_URL);

    const res = await fetch(`${API_BASE_URL}/supporters/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      let errorMsg = "";
      try {
        const data = await res.json();
        console.error("Response JSON:", data);
        errorMsg = data.detail || JSON.stringify(data);
      } catch {
        errorMsg = await res.text();
        console.error("Response text:", errorMsg);
      }
      throw new Error(`Error ${res.status}: ${errorMsg}`);
    }

    const data = await res.json();
    console.log("Supporters fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Error fetching supporters:", error);
    throw error;
  }
}

//============Update Supporter=========================

export async function updateSupporter(id, supporterData) {
  try {
    console.log(`Updating supporter with ID: ${id}`);

    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");
    console.log("Using token:", token);

    const API_BASE_URL = import.meta.env.VITE_API_URL;
    console.log("API_BASE_URL:", API_BASE_URL);

    const res = await fetch(`${API_BASE_URL}/supporters/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(supporterData),
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      let errorMsg = "";
      try {
        const data = await res.json();
        console.error("Response JSON:", data);
        errorMsg = data.detail || JSON.stringify(data);
      } catch {
        errorMsg = await res.text();
        console.error("Response text:", errorMsg);
      }
      throw new Error(`Error ${res.status}: ${errorMsg}`);
    }

    const data = await res.json();
    console.log("Supporter updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error updating supporter:", error);
    throw error;
  }
}

//============Remove Supporter=========================

export const deleteSupporter = async (id) => {
  try {
    console.log(`Deleting supporter with ID: ${id}`);

    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");
    console.log("Using token:", token);

    const API_BASE_URL = import.meta.env.VITE_API_URL;
    console.log("API_BASE_URL:", API_BASE_URL);

    const response = await fetch(`${API_BASE_URL}/supporters/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      let errorMsg = "";
      try {
        const data = await response.json();
        console.error("Response JSON:", data);
        errorMsg = data.detail || JSON.stringify(data);
      } catch {
        errorMsg = await response.text();
        console.error("Response text:", errorMsg);
      }
      throw new Error(`Error ${response.status}: ${errorMsg}`);
    }

    console.log("Supporter deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("Error deleting supporter:", error);
    throw error;
  }
};

//============Assign Permissions to Supporter=========================
export async function assignPermissions(supporterId, permissionIds) {
  const token = localStorage.getItem("token"); // adjust if you store token differently
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(
    `${API_BASE_URL}/api/supporters/${supporterId}/assign-permissions/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ permission_ids: permissionIds }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to assign permissions");
  }

  return response.json();
}



