exports.getWeather = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Weather fetch failed",
      });
    }

    res.json({
      temp: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
    });

  } catch (err) {
    console.error("Weather API Error:", err);
    res.status(500).json({ error: "Server error fetching weather" });
  }
};