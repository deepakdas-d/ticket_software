// src/components/SupporterProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useSupporterAuthContext } from "../../context/SupporterAuthProvider";

const SupporterProtectedRoute = ({ children }) => {
  const { user, isAuthLoading } = useSupporterAuthContext();

  // Optional: show a loading state while checking auth
  if (isAuthLoading) return <div>Loading...</div>;

  // If not logged in, redirect to login page
  if (!user) return <Navigate to="/supportsignin" replace />;

  return children;
};

export default SupporterProtectedRoute;
