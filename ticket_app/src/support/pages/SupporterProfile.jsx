import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SupporterSidebar from "../components/SideBar/SupporterSidebar";
import { useSupporterAuthContext } from "../context/SupporterAuthProvider";
import { getSupporterProfile } from "../services/SupportServices";
import "../styles/SupporterProfile.css";

const SupporterProfile = () => {
  const { user, isAuthLoading, login } = useSupporterAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/supportsignin");
    }
  }, [user, isAuthLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getSupporterProfile();
        if (profile) {
          login(profile); // refresh context with latest data
        }
      } catch (err) {
        console.error("Failed to fetch supporter profile:", err);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, login]);

  if (isAuthLoading) {
    return <p className="loading">Loading profile...</p>;
  }

  return (
    <div className="supporter-dashboard">
      <SupporterSidebar />

      <main className="main-content">
        <header className="topbar">
          <h1>My Profile</h1>
        </header>

        <section className="profile-content">
          <div className="profile-card">
            <div className="avatar-section">
              <img
                src={user?.avatar || "https://via.placeholder.com/100"}
                alt="Profile"
                className="profile-avatar-large"
              />
            </div>

            <div className="profile-details">
              <p>
                <strong>Username:</strong> {user?.username || "—"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "—"}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phone_number || "—"}
              </p>
              <p>
                <strong>Designation:</strong> {user?.designation || "—"}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SupporterProfile;
