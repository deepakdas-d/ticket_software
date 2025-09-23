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
