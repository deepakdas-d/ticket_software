import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
  const [user, setUser] = useState(null);

  // Save tokens in localStorage
  const login = (access, refresh) => {
    localStorage.setItem("authToken", access);
    localStorage.setItem("refreshToken", refresh);

    setAuthToken(access);
    setRefreshToken(refresh);
    // optional: decode JWT if you want user details
    setUser({ access });
  };

  // Clear tokens on logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");

    setAuthToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  useEffect(() => {
    // If token exists on page reload, set user
    if (authToken) {
      setUser({ access: authToken });
    }
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ authToken, refreshToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);


