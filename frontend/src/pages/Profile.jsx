import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProfile, updateProfile } from "../api/auth";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    land_size: "",
    soil_type: "",
    location: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      const updatedUser = {
        ...user,
        username: profile.username,
        email: profile.email,
        land_size: profile.land_size,
        soil_type: profile.soil_type,
        location: profile.location,
      };
      login({ token: localStorage.getItem("token"), user: updatedUser });
      setMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Unable to update profile.");
    }
  };

  if (loading) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <h2>{profile?.username || "Farmer"}</h2>
            <p className="email">{profile?.email}</p>
          </div>
        </div>

        {message && <div className="profile-message">{message}</div>}

        {!isEditing ? (
          <div className="profile-display">
            <div className="info-group">
              <label>Farm Size</label>
              <p>{profile?.land_size || "Not specified"} hectares</p>
            </div>
            <div className="info-group">
              <label>Location</label>
              <p>{profile?.location || "Not specified"}</p>
            </div>
            <div className="info-group">
              <label>Soil Type</label>
              <p>{profile?.soil_type || "Not specified"}</p>
            </div>

            <div className="profile-actions">
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                ✎ Edit Profile
              </button>
              <button
  onClick={() => navigate("/")}
  className="btn btn-home"
>
  🏠 Home
</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Farm Size (hectares)</label>
              <input
                type="number"
                name="land_size"
                value={profile.land_size || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={profile.location || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Soil Type</label>
              <select name="soil_type" value={profile.soil_type || ""} onChange={handleChange}>
                <option value="">Select soil type</option>
                <option value="Loamy">Loamy</option>
                <option value="Sandy">Sandy</option>
                <option value="Clay">Clay</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
