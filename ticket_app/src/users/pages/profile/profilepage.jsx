// pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authcontext";
import { getProfile } from "../../services/userservices";
import './profilestyle.css';


function ProfilePage() {
  const { authToken } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (authToken) {
      getProfile(authToken).then(setProfile).catch(console.error);
    }
  }, [authToken]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div><div className="profile-page">
      <h2>Profile Information</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone_number}</p>
      {profile?.complaints && (
  <p><strong>Total Complaints:</strong> {profile.complaints.length}</p>
)}
    </div></div>
  );
}

export default ProfilePage;
