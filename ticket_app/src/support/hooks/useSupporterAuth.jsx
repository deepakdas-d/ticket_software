import { useState, useEffect, useCallback } from "react";
import { supporterLogin, refreshAccessToken,supporterLogout } from "../services/supporterAuthService";

export const useSupporterAuth = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("supporterUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [tokens, setTokens] = useState(() => {
    const savedTokens = localStorage.getItem("supporterTokens");
    return savedTokens ? JSON.parse(savedTokens) : null;
  });
  const [loading, setLoading] = useState(false);

  const persistAuth = (userObj, tokenObj) => {
    localStorage.setItem("supporterUser", JSON.stringify(userObj));
    localStorage.setItem("supporterTokens", JSON.stringify(tokenObj));
    setUser(userObj);
    setTokens(tokenObj);
  };

  const signInSupporter = async (username, password) => {
    setLoading(true);
    try {
      const json = await supporterLogin(username, password);
      const userObj = { username: json.username, email: json.email };
      persistAuth(userObj, { access: json.access, refresh: json.refresh });
      return true;
    } finally {
      setLoading(false);
    }
  };

const signOut = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken || refreshToken) {
      try {
        await supporterLogout();
      } catch (err) {
        console.warn("Logout failed, trying refresh token...", err);
        if (refreshToken) {
          try {
            const newTokens = await refreshAccessToken();
            await supporterLogout();
          } catch (retryErr) {
            console.error("Retry logout failed:", retryErr);
          }
        }
      }
    }
  } finally {
    // 🔹 Clear all local storage & state
    localStorage.clear(); // removes everything
    setUser(null);
    setTokens(null);

    // 🔹 Optionally reload the page to clear React memory
    window.location.replace("/supportsignin");
  }
};



  const refreshToken = useCallback(async () => {
    if (!tokens?.refresh) return null;
    try {
      const json = await refreshAccessToken(tokens.refresh);
      const newTokens = { ...tokens, access: json.access };
      localStorage.setItem("supporterTokens", JSON.stringify(newTokens));
      setTokens(newTokens);
      return newTokens.access;
    } catch (err) {
      console.error("Refresh token failed:", err);
      signOut();
      return null;
    }
  }, [tokens]);

  // 🔄 Auto-refresh before access token expires
  useEffect(() => {
    if (!tokens?.access) return;

    // Example: JWT usually expires in ~5–15 min, refresh 1 min before
    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 14 * 60 * 1000); // refresh every 14 minutes (adjust to your backend expiry)

    return () => clearInterval(refreshInterval);
  }, [tokens, refreshToken]);

  return { user, tokens, loading, signInSupporter, signOut, refreshToken };
};
