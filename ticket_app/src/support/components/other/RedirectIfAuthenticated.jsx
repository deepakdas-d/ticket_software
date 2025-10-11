import { Navigate } from "react-router-dom";
import { useSupporterAuthContext } from "../../context/SupporterAuthProvider";

const RedirectIfAuthenticated = ({ children }) => {
  const { user, isAuthLoading } = useSupporterAuthContext();

  if (isAuthLoading) return <div>Loading...</div>;

  return user ? <Navigate to="/supportdashboard" replace /> : children;
};

export default RedirectIfAuthenticated;
