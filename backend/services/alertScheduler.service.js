// services/alertScheduler.service.js
const cron = require("node-cron");
const db = require("../config/db");
const { getWeather } = require("./weatherService");
const { sendMail } = require("./emailService");

cron.schedule("0 6 * * *", async () => {
  console.log("🌾 Running daily farm alert system...");

  const [crops] = await db.query("SELECT * FROM crop_tracking");

  for (let crop of crops) {
    const days =
      Math.floor(
        (new Date() - new Date(crop.planting_date)) /
          (1000 * 60 * 60 * 24)
      );

    let stage = "unknown";

    if (days <= 10) stage = "germination";
    else if (days <= 40) stage = "vegetative";
    else if (days <= 70) stage = "flowering";
    else stage = "maturity";

    const weather = await getWeather(crop.location || "Delhi");

    const temp = weather.main.temp;
    const rain = weather.rain ? true : false;

    let alerts = [];

    // 💧 Irrigation logic
    if (temp > 33 && !rain) {
      alerts.push("💧 Irrigate today - high temperature detected");
    }

    if (rain) {
      alerts.push("🌧 No irrigation needed - rain expected");
    }

    // 🧪 Fertilizer stage logic
    if (stage === "vegetative") {
      alerts.push("🧪 Apply nitrogen-rich fertilizer today");
    }

    if (stage === "flowering") {
      alerts.push("🌸 Apply potassium-rich fertilizer");
    }

    // 🐛 pest risk (AI suggestion can be added later)
    if (temp > 30) {
      alerts.push("🐛 High pest risk detected - monitor crops");
    }

    // 🌾 harvest reminder
    if (stage === "maturity") {
      alerts.push("🌾 Crop nearing harvest stage");
    }

    // 📧 Send only if alerts exist
    if (alerts.length > 0) {
      await sendMail(
        crop.email,
        `🌾 Farm Alert - ${stage.toUpperCase()}`,
        alerts.join("\n")
      );

      await db.query(
        "UPDATE crop_tracking SET last_alert_date=NOW(), current_stage=? WHERE id=?",
        [stage, crop.id]
      );
    }
  }
});