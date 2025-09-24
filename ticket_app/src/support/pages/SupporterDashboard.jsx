import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupporterAuthContext } from "../context/SupporterAuthProvider";
import SupporterSidebar from "../components/SideBar/SupporterSidebar"; 
import "../styles/SupporterDashboard.css";

const SupporterDashboard = () => {
  const { user, isAuthLoading } = useSupporterAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/supportsignin");
    }
  }, [user, isAuthLoading, navigate]);

  return (
    <div className="supporter-dashboard">
      <SupporterSidebar />
      <main className="main-content">
        <header className="topbar">
          <h1>Welcome, {user?.username || "Supporter"} 👋</h1>
        </header>
        <section className="dashboard-content">
          <div className="card">
            <h3>Active Tickets</h3>
            <p>12</p>
          </div>
          <div className="card">
            <h3>Resolved Today</h3>
            <p>5</p>
          </div>
          <div className="card">
            <h3>Pending Reviews</h3>
            <p>3</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SupporterDashboard;
