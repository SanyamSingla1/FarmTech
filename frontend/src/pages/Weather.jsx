import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getWeather } from "../api/api";
import "./Weather.css";

export default function Weather() {
  const { user } = useContext(AuthContext);

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.location) {
      setError("Location not found");
      setLoading(false);
      return;
    }

    fetchWeather();
  }, [user]);

  const fetchWeather = async () => {
    try {
      setLoading(true);

      const res = await getWeather(user.location);

      setWeather(res);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to fetch weather updates"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>
        Welcome, {user?.username || "Farmer"} 👋
      </h1>

      <div className="card">
        <h2>🌦️ Weather Updates</h2>

        {loading ? (
          <p>Loading weather...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="weather-info">
            <p>
              📍 <strong>Location:</strong>{" "}
              {user?.location}
            </p>

            <p>
              🌡 <strong>Temperature:</strong>{" "}
              {weather?.temp}°C
            </p>
            <p>💧 <strong>Humidity:</strong> {weather?.humidity}%</p>

            <p>
              ☁ <strong>Condition:</strong>{" "}
              {weather?.condition}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}