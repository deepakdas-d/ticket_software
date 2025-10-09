const API_BASE_URL = import.meta.env.VITE_API_URL;


//=========== Fetch Complaints==============
// Fetch Complaints with Pagination
export const fetchComplaints = async (page = 1, perPage = 10) => {
  console.log("📡 [fetchComplaints] Called with:", { page, perPage });

  try {
    const token = localStorage.getItem("accessToken");
    console.log("🔑 [fetchComplaints] Access token:", token ? "Token found" : "No token found");

    const url = `${API_BASE_URL}/tickets/supporter/complaints/?page=${page}&per_page=${perPage}`;
    console.log("🌐 [fetchComplaints] Fetching from URL:", url);

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    console.log("📨 [fetchComplaints] Headers:", headers);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    console.log("📥 [fetchComplaints] Response status:", response.status);

    if (response.status === 403) {
      const errData = await response.json();
      console.warn("🚫 [fetchComplaints] Permission denied:", errData);
      const error = new Error(errData.detail || "Permission denied");
      error.status = 403;
      throw error;
    }

    if (!response.ok) {
      console.error("❌ [fetchComplaints] HTTP error:", response.status);
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ [fetchComplaints] Data received:", data);

    const result = {
      complaints: data.results || data,
      totalRows: data.count || data.length,
    };
    console.log("📊 [fetchComplaints] Parsed result:", result);

    return result;
  } catch (error) {
    console.error("🔥 [fetchComplaints] Failed to fetch complaints:", error);
    throw error;
  }
};



//================update the UI of the Complaint==================
export async function updateComplaintStatus(complaintId, status, remarks) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No access token found");
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    status,
    remarks,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    `${API_BASE_URL}/tickets/supporter/complaints/${complaintId}/update-status/`,
    requestOptions
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update complaint");
  }

  return response.json();
}


//============Reassign=======================


export const updateComplaintDesignation = async (complaintId, designationId) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_BASE_URL}/tickets/supporter/complaints/${complaintId}/reassign/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,   // ✅ correct
      },
      body: JSON.stringify({ designation_id: designationId }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to update designation");
  }

  return response.json();
};

