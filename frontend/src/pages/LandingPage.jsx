import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleProtectedNavigation = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="landing-container">
      <Navbar />

      <main className="landing-main">
        <section className="hero">
          <div className="hero-content">
            <h2 className="hero-title">
              Smart Farming for Modern Farmers
            </h2>

            <p className="hero-subtitle">
              Maximize your crop yield with AI-powered
              recommendations, real-time alerts, and
              comprehensive farm management tools
            </p>

            {user ? (
              // <button
              //   onClick={() => navigate("/dashboard")}
              //   className="cta-button"
              // >
              //   Open Dashboard 📊
              // </button>)
              <p className="welcome-message">
                Welcome back, {user.username}! 👋
              </p>)
               : (
              <button
                onClick={() => navigate("/login")}
                className="cta-button"
              >
                Get Started 🚀
              </button>
            )}
          </div>

          <div className="hero-image">
            <div className="farm-illustration">
              🌱🌿🌾
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">
            Our Features
          </h2>

          <div className="features-grid">
            <div
              className="feature-card"
              onClick={() =>
                handleProtectedNavigation("/weather")
              }
            >
              <span className="feature-icon">🌦️</span>
              <h3>Weather Information</h3>
              <p>
                Get real-time weather updates for your farm
              </p>
            </div>
            <div
              className="feature-card"
              onClick={() =>
                handleProtectedNavigation("/crop-recommendations")
              }
            >
              <span className="feature-icon">🌾</span>
              <h3>Recommended Crops</h3>
              <p>
                AI-powered crop recommendations based on
                your location and soil type
              </p>
            </div>

            {/* <div
              className="feature-card"
              onClick={() =>
                handleProtectedNavigation("/crops")
              }
            >
              <span className="feature-icon">📊</span>
              <h3>Crop Management</h3>
              <p>
                Track growth stages, manage multiple crops,
                and maintain detailed harvest records
              </p>
            </div> */}

            {/* <div
              className="feature-card"
              onClick={() =>
                handleProtectedNavigation("/irrigation")
              }
            >
              <span className="feature-icon">💧</span>
              <h3>Smart Irrigation</h3>
              <p>
                Get real-time alerts and recommendations
                for optimal watering schedules
              </p>
            </div> */}

            <div
              className="feature-card"
              onClick={() =>
                handleProtectedNavigation("/fertilizer")
              }
            >
              <span className="feature-icon">🌱</span>
              <h3>Fertilizer Guide</h3>
              <p>
                Customized NPK recommendations based on
                soil type and growth stage
              </p>
            </div>

            <div
              className="feature-card"
              onClick={() =>
                handleProtectedNavigation("/chatbot")
              }
            >
              <span className="feature-icon">🤖</span>
              <h3>AI Assistant</h3>
              <p>
                Chat with our farming expert AI for
                instant answers to your questions
              </p>
            </div>

            <div
              className="feature-card"
              onClick={() =>
                handleProtectedNavigation("/disease-detection")
              }
            >
              <span className="feature-icon">🦠</span>
              <h3>Disease Detection</h3>
              <p>
                Upload crop images and get AI-powered
                disease identification and treatment plans
              </p>
            </div>

            {/* <div
              className="feature-card"
              onClick={() =>
                handleProtectedNavigation("/tasks")
              }
            >
              <span className="feature-icon">📅</span>
              <h3>Task Scheduler</h3>
              <p>
                Plan and track farm activities with
                reminders and notifications
              </p>
            </div> */}

            <div
              className="feature-card"
              onClick={() =>
                handleProtectedNavigation("/crop-cycle")
              }
            >
              <span className="feature-icon">🔔</span>
              <h3>Smart Alerts</h3>
              <p>
                Get notifications for weather,
                irrigation, fertilizer, and harvest times
              </p>
            </div>

            {/* <div
              className="feature-card"
              onClick={() =>
                handleProtectedNavigation("/profile")
              }
            >
              <span className="feature-icon">👤</span>
              <h3>Profile Management</h3>
              <p>
                Manage your farm details including land
                size, location, and soil type
              </p>
            </div> */}

          </div>
        </section>

        <section className="benefits-section">
          <h2 className="section-title">
            Why Choose FarmTech?
          </h2>

          <ul className="benefits-list">
            <li>
              ✓ Increase crop yield by up to 40% with
              smart recommendations
            </li>

            <li>
              ✓ Reduce water usage and save on irrigation
              costs
            </li>

            <li>
              ✓ Early disease detection to prevent crop
              losses
            </li>

            <li>
              ✓ Real-time weather-based notifications
            </li>

            <li>
              ✓ Complete farm history and analytics
            </li>

            <li>
              ✓ Email notifications
            </li>
          </ul>
        </section>
      </main>

      <footer className="landing-footer">
        <p>
          &copy; FarmTech. Empowering farmers with
          technology.
        </p>
      </footer>
    </div>
  );
}