import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // New state for auth initialization
  const navigate = useNavigate();

  // ================= Helpers =================
  const persistAuth = (user, tokens) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
  };

  const clearAuth = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // ================= Restore Session =================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsAuthLoading(false); // Mark auth initialization as complete
  }, []);

  // ================= Refresh Token =================
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/superadmin/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      let json;
      try {
        json = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error(json?.message || "Invalid refresh token");
          case 401:
          case 403:
            throw new Error("Session expired. Please sign in again.");
          case 500:
            throw new Error("Server error. Please try again later.");
          default:
            throw new Error(json?.message || "Token refresh failed");
        }
      }

      localStorage.setItem("accessToken", json.access);
      return json.access;
    } catch (err) {
      clearAuth();
      setUser(null);
      navigate("/adminsignin");
      throw err;
    }
  };

  // ================= API Request with Token Refresh =================
  const fetchWithToken = async (url, options = {}) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      try {
        const newAccessToken = await refreshToken();
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
        return retryResponse;
      } catch (err) {
        throw err;
      }
    }

    return response;
  };

  // ================= Login =================
  const signIn = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/superadmin/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      let json;
      try {
        json = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

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

      const userObj = { username: json.username, email: json.email };
      persistAuth(userObj, { access: json.access, refresh: json.refresh });
      setUser(userObj);

      navigate("/admindashboard");
    } catch (err) {
      if (err.name === "TypeError") {
        throw new Error("Network error. Please check your connection.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================= Logout =================
  const signOut = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken && accessToken) {
        const response = await fetchWithToken(
          `${import.meta.env.VITE_API_URL}/superadmin/logout/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ refresh: refreshToken }),
          }
        );

        if (!response.ok) {
          console.warn("Logout API failed:", response.status);
        } else {
          console.log("Logout successful");
        }
      }
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      setUser(null);
      clearAuth();
      navigate("/adminsignin");
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signIn, signOut, loading, fetchWithToken, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};