// services/schedulerService.js
const cron = require("node-cron");
const { getWeather } = require("./weatherService");
const { sendMail } = require("./emailService");
const db = require("../config/db");

cron.schedule("0 7 * * *", async () => {
  const [users] = await db.query("SELECT * FROM users");

  for (let user of users) {
    const weather = await getWeather(user.location);

    const temp = weather.main.temp;
    const rain = weather.rain ? true : false;

    let message = "";

    if (temp > 32 && !rain) {
      message = "🚨 Irrigate today due to high temperature";
    } else if (rain) {
      message = "🌧 No irrigation needed, rain expected";
    }

    if (message) {
      await sendMail(user.email, "Farm Alert", message);
    }
  }
});