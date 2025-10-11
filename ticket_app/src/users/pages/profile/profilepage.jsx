import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authcontext";
import { getProfile } from "../../services/userservices";
import { User, Mail, Phone, Ticket, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import './profilestyle.css';

function ProfilePage() {
  const { authToken } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (authToken) {
      getProfile(authToken).then(setProfile).catch(console.error);
    }
  }, [authToken]);

  if (!profile) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate complaint statistics
  const complaints = profile?.complaints || [];
  const totalComplaints = complaints.length;
  const openComplaints = complaints.filter(c => c.status === 'open' || c.status === 'pending').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Closed' || c.status === 'closed').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;

  // Get recent complaints (last 5)
  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="dashboardprofile-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back, {profile.username}!</p>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-content">
            <div className="profile-avatar">
              <User />
            </div>
            <div className="profile-info">
              <h2>{profile.username}</h2>
              <div className="profile-details">
                <div className="profile-detail-item">
                  <Mail />
                  <span>{profile.email}</span>
                </div>
                <div className="profile-detail-item">
                  <Phone />
                  <span>{profile.phone_number}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <h3>Total Tickets</h3>
                <p>{totalComplaints}</p>
              </div>
              <div className="stat-icon">
                <Ticket />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <h3>Open Tickets</h3>
                <p>{openComplaints}</p>
              </div>
              <div className="stat-icon">
                <Clock />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <h3>In Progress</h3>
                <p>{inProgressComplaints}</p>
              </div>
              <div className="stat-icon">
                <AlertCircle />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <h3>Resolved</h3>
                <p>{resolvedComplaints}</p>
              </div>
              <div className="stat-icon">
                <CheckCircle />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="tickets-section">
          <div className="tickets-header">
            <h3>Recent Tickets</h3>
            {/* <button className="view-all-btn">View All</button> */}
          </div>

          {recentComplaints.length > 0 ? (
            <div className="tickets-list">
              {recentComplaints.map((complaint, index) => (
                <div key={index} className="ticket-item">
                  <div className="ticket-content">
                    <div className="ticket-header">
                      <h6 className="ticket-title">
                        {complaint.title || `Ticket #${complaint.ticket_id}`}
                      </h6>
                      <span className={`ticket-status status-${complaint.status}`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="ticket-description">
                      {complaint.description || 'No description available'}
                    </p>
                    <p className="ticket-date">
                      Created: {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Ticket />
              <p>No tickets found</p>
              <p className="subtitle">Your support tickets will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;