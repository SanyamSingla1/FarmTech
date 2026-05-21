import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getFertilizerRecommendation } from "../api/api";
import Navbar from "../components/Navbar";
import "./FertilizerRecommendations.css";
import "./FertilizerRecommendations-cards.css";

export default function FertilizerRecommendations() {
  const { user } = useContext(AuthContext);
  const [crop, setCrop] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!crop.trim()) {
      setError("Please enter a crop name.");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendation(null);

    try {
      const res = await getFertilizerRecommendation(crop.trim(), user);
      if (!res) {
        setError("No recommendation returned.");
      } else {
        setRecommendation(res);
      }
    } catch (err) {
      console.error("Fertilizer recommendation error:", err);
      setError(err.response?.data?.message || "Failed to fetch recommendation.");
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!recommendation) return null;

    let data = recommendation;
    if (typeof recommendation === "string") {
      try {
        data = JSON.parse(recommendation);
      } catch {
        return <p className="raw-recommendation">{recommendation}</p>;
      }
    }

    // Handle different response structures
    const fertilizers = data?.recommendation?.fertilizers || data?.fertilizers || [];

    if (!fertilizers.length) {
      return <p className="no-recommendations">No fertilizer data available.</p>;
    }

    return (
      <div className="fertilizer-cards-grid">
        {fertilizers.map((fert, index) => (
          <div key={index} className="fert-card">
            <div className="fert-card-header">
              <h4>🌾 {fert.name || `Fertilizer ${index + 1}`}</h4>
            </div>
            <div className="fert-card-body">
              {fert.description && (
                <div className="fert-section">
                  <strong>Description:</strong>
                  <p>{fert.description}</p>
                </div>
              )}
              {fert.usage && (
                <div className="fert-section">
                  <strong>Usage:</strong>
                  <p>{fert.usage}</p>
                </div>
              )}
              {fert.nutrient_ratio && (
                <div className="fert-section">
                  <strong>NPK Ratio:</strong>
                  <p className="npk-value">{fert.nutrient_ratio}</p>
                </div>
              )}
              {fert.application_rate && (
                <div className="fert-section">
                  <strong>Application Rate:</strong>
                  <p>{fert.application_rate}</p>
                </div>
              )}
              {fert.benefits && fert.benefits.length > 0 && (
                <div className="fert-section">
                  <strong>Benefits:</strong>
                  <ul className="benefits-list">
                    {fert.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
              {fert.precautions && fert.precautions.length > 0 && (
                <div className="fert-section">
                  <strong>Precautions:</strong>
                  <ul className="precautions-list">
                    {fert.precautions.map((precaution, i) => (
                      <li key={i}>{precaution}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fertilizer-page">
      <Navbar />
      <div className="fertilizer-recommendations">
        <div className="recommendations-header">
          <h2>🌱 Fertilizer Recommendations</h2>
          <p>Generate fertilizer guidance based on your crop.</p>
          {user && (
            <div className="user-profile-info">
              <span>📍 {user.location || "Location not set"}</span>
              <span>🌱 Soil Type: {user.soil_type || "Not set"}</span>
            </div>
          )}
        </div>

        <form className="fertilizer-form" onSubmit={handleSubmit}>
          <label htmlFor="cropName">Crop Name</label>
          <input
            id="cropName"
            type="text"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="e.g., Rice, Wheat, Maize"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Generating recommendation..." : "Get Recommendation"}
          </button>
        </form>

        {error && <div className="error-message">⚠️ {error}</div>}

        {recommendation && (
          <div className="recommendation-result">
            <h3>Recommendation</h3>
            {renderResult()}
          </div>
        )}
      </div>
    </div>
  );
}
