// src/services/supporterService.js
const API_BASE_URL = import.meta.env.VITE_API_URL;

//================== Supporter Login =================
export const supporterLogin = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/supporters/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const json = await response.json().catch(() => {
      throw new Error("Invalid server response");
    });

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error(json?.message || "Invalid request");
        case 401:
          throw new Error("Incorrect username or password");
        case 403:
          throw new Error("You don’t have permission to access this resource");
        case 500:
          throw new Error("Server error. Please try again later");
        default:
          throw new Error(json?.message || "Login failed");
      }
    }

    // ✅ Store tokens in localStorage
    if (json.access) localStorage.setItem("accessToken", json.access);
    if (json.refresh) localStorage.setItem("refreshToken", json.refresh);

    return json; // { access, refresh, username, email }
  } catch (err) {
    if (err.name === "TypeError") {
      throw new Error("Network error. Please check your connection.");
    }
    throw err;
  }
};

//================== Refresh Token =================
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await fetch(`${API_BASE_URL}/supporters/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const json = await response.json().catch(() => {
      throw new Error("Invalid server response");
    });

    if (!response.ok) {
      throw new Error(json?.message || "Failed to refresh token");
    }

    // ✅ Store new access token
    if (json.access) localStorage.setItem("accessToken", json.access);

    return json; // { access: newAccessToken }
  } catch (err) {
    if (err.name === "TypeError") {
      throw new Error("Network error. Please check your connection.");
    }
    throw err;
  }
};

//================== Supporter Logout =================
export const supporterLogout = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken && !refreshToken) {
      throw new Error("No tokens found");
    }

    const response = await fetch(`${API_BASE_URL}/supporters/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { "Authorization": `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({ refresh: refreshToken }), // backend usually needs refresh token
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Logout failed:", response.status, text);
      throw new Error("Logout failed");
    }

    return true;
  } catch (err) {
    console.error("Logout error:", err);
    return false;
  }
};

