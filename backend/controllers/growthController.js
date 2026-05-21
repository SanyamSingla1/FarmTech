// controllers/growthController.js
const db = require("../config/db");
const { predictGrowthTimeline } = require("../services/growthService");
const { getWeather } = require("../services/weatherService");

exports.getGrowthPlan = async (req, res) => {
  const [user] = await db.query("SELECT * FROM users WHERE id=?", [
    req.user.id,
  ]);

  const { crop_name, planting_date } = req.body;

  const weather = await getWeather(user[0].location);

  const aiResult = await predictGrowthTimeline({
    crop: crop_name,
    soil: user[0].soil_type,
    location: user[0].location,
    planting_date,
    weather: weather.main.temp,
  });

  res.json(aiResult);
};