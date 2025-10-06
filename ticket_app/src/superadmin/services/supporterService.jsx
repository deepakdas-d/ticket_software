// src/services/supporterService.js
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const registerSupporter = async (supporterData) => {
  try {
    const token = localStorage.getItem("accessToken");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (token) {
      myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(supporterData),
    };

    const res = await fetch(`${API_BASE_URL}/supporters/register/`, requestOptions);

    if (!res.ok) {
      let errMsg = "Failed to register supporter";
      try {
        const err = await res.json();
        errMsg = err.message || err.detail || JSON.stringify(err);
      } catch {
        // non-JSON response
      }
      throw new Error(errMsg);
    }

    const data = await res.json();

    // Success alert
    window.alert("Supporter registered successfully!");

    return data;
  } catch (error) {
    throw error;
  }
};

//================Fetch all Permissions==========================
export async function fetchPermissions() {
  try {
    console.log("Fetching permissions...");

    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");
    console.log("Using token:", token);

    const API_BASE_URL = import.meta.env.VITE_API_URL;
    console.log("API_BASE_URL:", API_BASE_URL);

    const res = await fetch(`${API_BASE_URL}/supporters/permissions/`, {
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
    console.log("Permissions fetched successfully:", data);
    return data; // array of permissions
  } catch (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }
}
