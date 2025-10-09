// src/api/authService.js

const BASE_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/users/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return response.json();
};

export const registerUser = async ({ username, email, password, phone }) => {
  console.log("🟢 [registerUser] Starting user registration...");
   console.log("🌐 [registerUser] Base URL:", BASE_URL);
  console.log("➡️ Request Data:", { username, email, phone });

  try {
    const response = await fetch(`${BASE_URL}/users/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        phone_number: phone,
      }),
    });

    console.log("📩 [registerUser] Response status:", response.status);

    const responseData = await response.json().catch(() => {
      console.warn("⚠️ Failed to parse JSON response");
      return null;
    });

    if (!response.ok) {
      console.error("❌ [registerUser] Registration failed:", responseData);
      throw new Error(responseData?.detail || "Registration failed");
    }

    console.log("✅ [registerUser] Registration successful:", responseData);
    return responseData;
  } catch (error) {
    console.error("🚨 [registerUser] Error occurred:", error);
    throw error;
  }
};

export const logoutUser = async (authToken, refreshToken, logout) => {
  if (!authToken || !refreshToken) {
    logout();
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/users/logout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (res.ok) logout();
  } catch (err) {
    console.error("Logout error:", err);
  }
};

