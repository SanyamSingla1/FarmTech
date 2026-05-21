const cron = require("node-cron");
const pool = require("../config/db");
const { sendEmail } = require("../services/emailService");

cron.schedule("0 8 * * *", async () => {
  try {
    console.log("Running daily crop alert job...");

    const [users] = await pool.query(`
      SELECT id, username, email, crop, location
      FROM users
      WHERE crop IS NOT NULL
    `);

    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: `🌾 Daily Crop Alert - ${user.crop}`,
        html: `
          <div style="font-family:Arial">
            <h2>Hello ${user.username} 👋</h2>

            <h3>🌾 Crop Alert: ${user.crop}</h3>

            <p><b>📍 Location:</b> ${user.location}</p>

            <p>Today’s farming reminders:</p>
            <ul>
              <li>Check irrigation</li>
              <li>Monitor pests</li>
              <li>Apply fertilizers on schedule</li>
            </ul>

            <p>🚜 Happy Farming!</p>
          </div>
        `,
      });
    }

    console.log("✅ Alerts sent successfully");
  } catch (err) {
    console.error("❌ Cron job error:", err);
  }
});