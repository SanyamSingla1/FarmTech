import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getCropRecommendation } from "../api/api";
import Navbar from "../components/Navbar";
import "./CropRecommendations.css";

export default function CropRecommendations() {
  const { user } = useContext(AuthContext);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecommendation();
  }, []);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getCropRecommendation(user);
      if (!res || !res.recommendation) {
        setError("No recommendation returned from the backend.");
        return;
      }

      setRecommendation(res.recommendation);
    } catch (err) {
      console.error("Error fetching crop recommendation:", err);
      setError(err.response?.data?.message || "Unable to load crop recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const renderRecommendation = () => {
    if (!recommendation) return null;

    let crops = [];
    let parsedData = null;

    // Try to parse the recommendation
    if (typeof recommendation === "string") {
      try {
        const parsed = JSON.parse(recommendation);
        parsedData = parsed;
        crops = parsed.recommended_crops || [];
      } catch (e) {
        console.log("Failed to parse as JSON, showing raw text", e);
        return (
          <div className="raw-recommendation">
            <p>{recommendation}</p>
          </div>
        );
      }
    } else if (typeof recommendation === "object") {
      parsedData = recommendation;
      crops = recommendation.recommended_crops || [];
    }

    if (crops.length === 0) {
      console.log("No crops found, parsedData:", parsedData);
      return (
        <div className="no-crops">
          <p>No crop recommendations available.</p>
        </div>
      );
    }

    return (
      <div className="recommendations-grid">
        {crops.map((crop, index) => (
          <div key={index} className="crop-card">
            <div className="crop-header">
              <span className="crop-emoji">🌾</span>
              <h3>{crop.crop || "Unknown Crop"}</h3>
            </div>

            {crop.variety && (
              <div className="crop-variety">
                <strong>Variety:</strong> {crop.variety}
              </div>
            )}

            <div className="crop-details">
              {crop.season && (
                <div className="detail-item">
                  <span className="detail-label">🌍 Season</span>
                  <span className="detail-value">{crop.season}</span>
                </div>
              )}
              {crop.profitability && (
                <div className="detail-item">
                  <span className="detail-label">💰 Profitability</span>
                  <span className="detail-value capitalize">
                    {crop.profitability}
                  </span>
                </div>
              )}
              {crop.duration && (
                <div className="detail-item">
                  <span className="detail-label">⏱️ Duration</span>
                  <span className="detail-value">{crop.duration}</span>
                </div>
              )}
              {crop.yield && (
                <div className="detail-item">
                  <span className="detail-label">📊 Expected Yield</span>
                  <span className="detail-value">{crop.yield}</span>
                </div>
              )}
            </div>

            {crop.reason && (
              <div className="crop-description">
                <strong>Why This Crop?</strong>
                <p>{crop.reason}</p>
              </div>
            )}

            {crop.benefits && (
              <div className="crop-benefits">
                <strong>Benefits:</strong>
                <ul>
                  {Array.isArray(crop.benefits) ? (
                    crop.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))
                  ) : (
                    <li>{crop.benefits}</li>
                  )}
                </ul>
              </div>
            )}

            {crop.yield_per_hectare && (
              <div className="yield-info">
                <strong>Yield per Hectare:</strong> {crop.yield_per_hectare}
              </div>
            )}

            {crop.profit_potential && (
              <div className="profit-info">
                <strong>Profit Potential:</strong> {crop.profit_potential}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="crop-recommendations-page">
      <Navbar />
      <div className="crop-recommendations-container">
        <div className="recommendations-header">
          <h1>🌾 Crop Recommendations</h1>
          <p>Based on your farm profile and AI suggestions</p>
          {user && (
            <div className="user-profile-info">
              <span>📍 Location: {user.location || "Not specified"}</span>
              <span>🌱 Soil Type: {user.soil_type || "Not specified"}</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading recommendations...</p>
          </div>
        )}
        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button className="retry-btn" onClick={fetchRecommendation}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && recommendation && (
          <div className="recommendation-result">{renderRecommendation()}</div>
        )}
      </div>
    </div>
  );
}
