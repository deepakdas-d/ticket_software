const API_BASE_URL = import.meta.env.VITE_API_URL;


//=========== Fetch Complaints==============
// Fetch Complaints with Pagination
export const fetchComplaints = async (page = 1, perPage = 10) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Fetching complaints with token:", token);

    const response = await fetch(
      `${API_BASE_URL}/tickets/supporter/complaints/?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    console.log("Raw response:", response);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      complaints: data.results || data, // Adjust based on your API response structure
      totalRows: data.count || data.length, // Total number of complaints
    };
  } catch (error) {
    console.error("Failed to fetch complaints:", error);
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

