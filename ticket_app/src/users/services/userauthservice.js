// src/api/authService.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return await response.json();
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

