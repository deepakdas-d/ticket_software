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

    return data; // { username, email, phone_number, designation }
  } catch (error) {
    console.error("Error fetching supporter profile:", error);
    throw error;
  }
};
