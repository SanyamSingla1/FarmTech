const express = require("express");
const router = express.Router();

const weather = require("../controllers/weatherController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, weather.getWeather);

module.exports = router;