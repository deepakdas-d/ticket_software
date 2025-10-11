import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SupporterSidebar from "../components/SideBar/SupporterSidebar";
import { getSupporterProfile, fetchDesignations } from "../services/SupportServices";
import "../styles/SupporterProfile.css";
import { FaBars, FaUserCircle } from "react-icons/fa";

const SupporterProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [designationName, setDesignationName] = useState("—");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileWithDesignation = async () => {
      try {
        const data = await getSupporterProfile();
        if (!data) {
          navigate("/supportsignin");
          return;
        }

        const designations = await fetchDesignations();
        const matchedDesignation = designations.find(
          (d) => d.id === data.designation
        );
        setDesignationName(matchedDesignation?.name || "—");
        setProfile({ ...data, designation_name: matchedDesignation?.name || "—" });
      } catch (err) {
        console.error("Failed to fetch profile or designation:", err);
        navigate("/supportsignin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileWithDesignation();
  }, [navigate]);

  if (isLoading || !profile) {
    return (
      <div className="loading-screen">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="supporter-dashboard">
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <SupporterSidebar />
      </div>

      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars size={20} />
          </button>
          <h1
  style={{
    background: "linear-gradient(180deg, #1e3c72, #2a5298)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "700"
  }}
>
  My Profile
</h1>

        </header>

        <section className="profile-content">
          <div className="profile-card shadow">
            <div className="avatar-section">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="profile-avatar-large"
                />
              ) : (
                <FaUserCircle size={100} color="#2a5298" />
              )}
              <h2 className="mt-3">{profile?.username}</h2>
              <span className="badge bg-primary">
                Designation: {designationName}
              </span>
            </div>

            <div className="profile-details">
              <div className="detail-row">
                <strong>Email:</strong> <span>{profile?.email || "—"}</span>
              </div>
              <div className="detail-row">
                <strong>Phone:</strong>{" "}
                <span>{profile?.phone_number || "—"}</span>
              </div>

              {profile?.permissions?.length > 0 && (
                <div className="detail-row">
                  <strong>Permissions:</strong>
                  <ul>
                    {profile.permissions.map((p) => (
                      <li key={p.id}>{p.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SupporterProfile;