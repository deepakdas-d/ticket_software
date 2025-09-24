// src/context/SupporterAuthProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create Context
const SupporterAuthContext = createContext(null);

export const SupporterAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  // On mount, check if supporter is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("supporterUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsAuthLoading(false);
  }, []);

  // Login (you can adapt this to your API)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("supporterUser", JSON.stringify(userData));
    navigate("/supportdashboard");
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("supporterUser");
    navigate("/supportsignin");
  };

  const value = {
    user,
    isAuthLoading,
    login,
    logout,
  };

  return (
    <SupporterAuthContext.Provider value={value}>
      {children}
    </SupporterAuthContext.Provider>
  );
};

// Custom hook
export const useSupporterAuthContext = () => {
  const context = useContext(SupporterAuthContext);
  if (!context) {
    throw new Error(
      "useSupporterAuthContext must be used within a SupporterAuthProvider"
    );
  }
  return context;
};
export default SupporterAuthContext;