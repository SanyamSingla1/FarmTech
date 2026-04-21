import { useEffect, useState } from "react";
import { getWeather, getAI } from "../api/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [aiResult, setAIResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
const cropImages = {
    Wheat: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Wheat_field.jpg",
    Mustard: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Mustard_field.jpg",
    Moong: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Green_gram_plant.jpg",
    Rice: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Rice_fields.jpg",
  };

  // 🌦️ Load weather on page load
  useEffect(() => {
    const loadWeather = async () => {
      try {
        const res = await getWeather("Delhi");

        if (res?.error) {
          console.error(res.error);
          return;
        }

        setWeather(res);
      } catch (err) {
        console.error("Weather error:", err);
      }
    };

    loadWeather();
  }, []);

  // 🤖 AI FUNCTION
  const handleGetCrop = async () => {
    setLoading(true);

    try {
      if (!user?.soil || !user?.location) {
        alert("Missing user data (soil/location)");
        setLoading(false);
        return;
      }

      const res = await getAI({
        soil: user.soil,
        location: user.location,
        weather: weather?.condition || "Normal",
        farmSize: user.farmSize || "unknown",
      });

      if (res?.error) {
        alert(res.error);
        setLoading(false);
        return;
      }

      setAIResult(res.result);
    } catch (err) {
      console.error("AI error:", err);
      alert("AI request failed");
    }

    setLoading(false);
  };

  // 🧠 Render AI result safely
 const renderAIResult = () => {
  if (!aiResult) return null;

  try {
    const data =
      typeof aiResult === "string" ? JSON.parse(aiResult) : aiResult;

    return data.crops.map((crop, index) => (
      <div key={index} className="crop-card">

        <img
          src={cropImages[crop.name] || "https://via.placeholder.com/150"}
          alt={crop.name}
          className="crop-img"
        />

        <h3>{crop.name}</h3>
        <p>{crop.reason}</p>
        <small>{crop.variety}</small>
      </div>
    ));
  } catch (err) {
    return <p>Error parsing AI response</p>;
  }
};

  return (
    <div className="dashboard">
      <h2>Welcome, {user?.name} 👋</h2>

      {/* 🌦️ WEATHER CARD */}
      <div className="card">
        <h3>Weather</h3>
        {weather ? (
          <>
            <p>🌡 Temp: {weather.temp}°C</p>
            <p>💧 Humidity: {weather.humidity}%</p>
            <p>☁ Condition: {weather.condition}</p>
          </>
        ) : (
          <p>Loading weather...</p>
        )}
      </div>

      {/* 🤖 AI CARD */}
      <div className="card">
        <h3>Crop Recommendation</h3>

        <button onClick={handleGetCrop} disabled={loading}>
          {loading ? "Generating..." : "Get Recommendation"}
        </button>

        <div className="ai-result">{renderAIResult()}</div>
      </div>
    </div>
  );
}