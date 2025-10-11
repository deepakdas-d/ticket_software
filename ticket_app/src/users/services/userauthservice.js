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

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
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

// Get messages for a specific ticket

export const verifyOtp = async (email, otp) => {
  try {
    const res = await fetch(`${BASE_URL}/users/verify-email/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return res.json();
  } catch (err) {
    throw err;
  }
};


