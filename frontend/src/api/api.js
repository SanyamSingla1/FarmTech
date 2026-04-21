const BASE = "http://localhost:5000/api";

// 🌦️ WEATHER
export const getWeather = async (city) => {
  try {
    const res = await fetch(`${BASE}/weather?city=${city}`);
    return await res.json();
  } catch (err) {
    console.error("Weather API error:", err);
    return { error: "Weather failed" };
  }
};

// 🤖 AI
export const getAI = async (data) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return { error: "No token found. Please login again." };
    }

    const res = await fetch(`${BASE}/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    // 🚨 IMPORTANT: handle backend errors
    if (!res.ok) {
      return { error: result.error || "AI request failed" };
    }

    return result;

  } catch (err) {
    console.error("AI API error:", err);
    return { error: "AI server error" };
  }
};