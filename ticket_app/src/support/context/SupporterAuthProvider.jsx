import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supporterLogin, supporterLogout, refreshAccessToken } from "../services/supporterAuthService";

const SupporterAuthContext = createContext(null);

export const SupporterAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("supporterUser");
    const storedTokens = localStorage.getItem("supporterTokens");
    if (storedUser && storedTokens) {
      setUser(JSON.parse(storedUser));
      setTokens(JSON.parse(storedTokens));
    }
    setIsAuthLoading(false);
  }, []);

  const login = async (username, password) => {
    const json = await supporterLogin(username, password);
    const userObj = { username: json.username, email: json.email };
    const tokenObj = { access: json.access, refresh: json.refresh };

    localStorage.setItem("supporterUser", JSON.stringify(userObj));
    localStorage.setItem("supporterTokens", JSON.stringify(tokenObj));

    setUser(userObj);
    setTokens(tokenObj);

    window.location.replace("/supportdashboard");
  };

  const logout = async () => {
    await supporterLogout();
    localStorage.clear();
    setUser(null);
    setTokens(null);
    navigate("/supportsignin");
  };

  const refreshToken = async () => {
    if (!tokens?.refresh) return null;
    try {
      const json = await refreshAccessToken(tokens.refresh);
      const newTokens = { ...tokens, access: json.access };
      localStorage.setItem("supporterTokens", JSON.stringify(newTokens));
      setTokens(newTokens);
      return newTokens.access;
    } catch (err) {
      logout();
      return null;
    }
  };

  return (
    <SupporterAuthContext.Provider value={{ user, tokens, isAuthLoading, login, logout, refreshToken }}>
      {children}
    </SupporterAuthContext.Provider>
  );
};

export const useSupporterAuthContext = () => {
  const context = useContext(SupporterAuthContext);
  if (!context) throw new Error("useSupporterAuthContext must be used within SupporterAuthProvider");
  return context;
};
