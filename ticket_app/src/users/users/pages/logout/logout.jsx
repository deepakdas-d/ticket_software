import { logoutUser } from "../../services/userauthservice";
import { useNavigate } from "react-router-dom";

function SomeComponent() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      await logoutUser(token, refreshToken);

      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");

      navigate("/login");
    } catch (error) {
      alert("Logout failed. Please try again.");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
