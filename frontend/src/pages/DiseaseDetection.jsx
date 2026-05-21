import React, { useState } from "react";
import { detectDisease } from "../api/api";
import "./DiseaseDetection.css";

export default function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();

      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      setError("Please select an image.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError("");
      setResult(null);

      const response = await detectDisease(selectedImage);

      console.log("Disease Result:", response);

      setResult(response);
    } catch (err) {
      console.error("Disease detection error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to analyze image."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="disease-detection">
      <h2>🦠 Plant Disease Detection</h2>

      <div className="upload-section">
        <label
          htmlFor="image-upload"
          className="upload-label"
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="image-preview"
            />
          ) : (
            <div className="upload-placeholder">
              📷
              <br />
              Upload Crop Image
            </div>
          )}
        </label>

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />

        <button
          onClick={analyzeImage}
          disabled={!selectedImage || isAnalyzing}
          className="btn-analyze"
        >
          {isAnalyzing
            ? "Analyzing..."
            : "Analyze Image"}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {result?.result && (
        <div className="analysis-result">
          <h3>🌱 Disease Analysis Result</h3>

          <div className="result-card">
            <p>
              <strong>🦠 Disease:</strong>{" "}
              {result.result.disease || "Unknown"}
            </p>

            <p>
              <strong>📊 Confidence:</strong>{" "}
              {result.result.confidence || "N/A"}
            </p>

            <p>
              <strong>⚠️ Cause:</strong>{" "}
              {result.result.cause || "N/A"}
            </p>

            <div className="result-section">
              <strong>🤒 Symptoms:</strong>

              <ul>
                {result.result.symptoms &&
                result.result.symptoms.length > 0 ? (
                  result.result.symptoms.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )
                ) : (
                  <li>No symptoms available</li>
                )}
              </ul>
            </div>

            <div className="result-section">
              <strong>💊 Treatment:</strong>

              <ul>
                {result.result.treatment &&
                result.result.treatment.length > 0 ? (
                  result.result.treatment.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )
                ) : (
                  <li>No treatment available</li>
                )}
              </ul>
            </div>

            <div className="result-section">
              <strong>🌿 Fertilizer:</strong>

              <ul>
                {result.result.fertilizer &&
                result.result.fertilizer.length >
                  0 ? (
                  result.result.fertilizer.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )
                ) : (
                  <li>No fertilizer recommendation</li>
                )}
              </ul>
            </div>

            <div className="result-section">
              <strong>🛡️ Prevention:</strong>

              <ul>
                {result.result.prevention &&
                result.result.prevention.length >
                  0 ? (
                  result.result.prevention.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )
                ) : (
                  <li>No prevention data</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}