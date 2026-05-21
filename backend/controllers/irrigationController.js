const db = require("../config/db");
const axios = require("axios");
const nodemailer = require("nodemailer");

// ======================================
// EMAIL TRANSPORTER
// ======================================
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ======================================
// GET IRRIGATION ALERTS
// ======================================
exports.getIrrigationAlerts = async (req, res) => {

  try {

    const userId = req.user.id;

    const sql = `
      SELECT *
      FROM irrigationAlerts
      WHERE userId = ?
      ORDER BY createdAt DESC
    `;

    db.query(sql, [userId], (err, results) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      return res.json({
        success: true,
        count: results.length,
        alerts: results,
      });

    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// CREATE IRRIGATION ALERT
// ======================================
exports.createIrrigationAlert = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      cropId,
      alertLevel,
      moistureLevel,
      recommendedWaterAmount,
      message,
    } = req.body;

    if (!cropId || !alertLevel || !message) {

      return res.status(400).json({
        success: false,
        message: "cropId, alertLevel and message are required",
      });

    }

    const sql = `
      INSERT INTO irrigationAlerts
      (
        userId,
        cropId,
        alertLevel,
        moistureLevel,
        recommendedWaterAmount,
        message
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        userId,
        cropId,
        alertLevel,
        moistureLevel || null,
        recommendedWaterAmount || null,
        message,
      ],
      async (err, result) => {

        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        // ============================
        // SEND EMAIL NOTIFICATION
        // ============================

        const userSql = `
          SELECT email
          FROM users
          WHERE id = ?
        `;

        db.query(userSql, [userId], async (err, users) => {

          if (!err && users.length > 0) {

            const email = users[0].email;

            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: "Smart Irrigation Alert",
              html: `
                <h2>Irrigation Alert</h2>

                <p><strong>Alert Level:</strong> ${alertLevel}</p>

                <p><strong>Message:</strong> ${message}</p>

                <p><strong>Recommended Water:</strong> ${recommendedWaterAmount || "Not specified"}</p>

                <p><strong>Moisture Level:</strong> ${moistureLevel || "Not specified"}</p>
              `,
            };

            try {
              await transporter.sendMail(mailOptions);
            } catch (mailError) {
              console.log("Email Error:", mailError.message);
            }
          }
        });

        return res.status(201).json({
          success: true,
          message: "Irrigation alert created successfully",
          alertId: result.insertId,
        });

      }
    );

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// MARK ALERT AS READ
// ======================================
exports.markAsRead = async (req, res) => {

  try {

    const { alertId } = req.params;

    const userId = req.user.id;

    const sql = `
      UPDATE irrigationAlerts
      SET isRead = true
      WHERE id = ? AND userId = ?
    `;

    db.query(sql, [alertId, userId], (err, result) => {

      if (err) {

        return res.status(500).json({
          success: false,
          message: err.message,
        });

      }

      if (result.affectedRows === 0) {

        return res.status(404).json({
          success: false,
          message: "Alert not found",
        });

      }

      return res.json({
        success: true,
        message: "Alert marked as read",
      });

    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// DELETE ALERT
// ======================================
exports.deleteAlert = async (req, res) => {

  try {

    const { alertId } = req.params;

    const userId = req.user.id;

    const sql = `
      DELETE FROM irrigationAlerts
      WHERE id = ? AND userId = ?
    `;

    db.query(sql, [alertId, userId], (err, result) => {

      if (err) {

        return res.status(500).json({
          success: false,
          message: err.message,
        });

      }

      if (result.affectedRows === 0) {

        return res.status(404).json({
          success: false,
          message: "Alert not found",
        });

      }

      return res.json({
        success: true,
        message: "Alert deleted successfully",
      });

    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// SMART WEATHER IRRIGATION ALERT
// ======================================
exports.generateWeatherAlert = async (req, res) => {

  try {

    const userId = req.user.id;

    const userSql = `
      SELECT location
      FROM users
      WHERE id = ?
    `;

    db.query(userSql, [userId], async (err, users) => {

      if (err) {

        return res.status(500).json({
          success: false,
          message: err.message,
        });

      }

      if (users.length === 0) {

        return res.status(404).json({
          success: false,
          message: "User not found",
        });

      }

      const location = users[0].location;

      const weatherUrl = `
https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric
`;

      const weatherResponse = await axios.get(weatherUrl);

      const weather = weatherResponse.data;

      const temperature = weather.main.temp;

      const humidity = weather.main.humidity;

      const rainfall = weather.rain ? true : false;

      let alertLevel = "low";

      let message = "";

      let waterAmount = "Normal";

      if (temperature > 35 && humidity < 40) {

        alertLevel = "high";

        message = "High temperature detected. Increase irrigation immediately.";

        waterAmount = "High";

      }
      else if (rainfall) {

        alertLevel = "low";

        message = "Rainfall detected. Reduce irrigation today.";

        waterAmount = "Low";

      }
      else {

        alertLevel = "medium";

        message = "Moderate weather conditions. Maintain regular irrigation.";

        waterAmount = "Medium";

      }

      return res.json({
        success: true,

        weather: {
          temperature,
          humidity,
          condition: weather.weather[0].main,
        },

        irrigationRecommendation: {
          alertLevel,
          recommendedWaterAmount: waterAmount,
          message,
        },
      });

    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};