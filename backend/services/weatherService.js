// services/weatherService.js
const axios = require("axios");

exports.getWeather = async (location) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_KEY}&units=metric`;

  const res = await axios.get(url);
  return res.data;
};