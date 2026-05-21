const db = require("../config/db");
const axios = require("axios");
const nodemailer = require("nodemailer");
const groqService = require("../config/groq");

// ===============================
// EMAIL SETUP
// ===============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===============================
// GET NOTIFICATIONS
// ===============================
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const [results] = await db.promise().query(
      "SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC",
      [userId]
    );

    res.json({ success: true, notifications: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// CREATE NOTIFICATION
// ===============================
exports.createNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      message,
      type,
      notificationType,
      relatedCropId,
      actionUrl,
    } = req.body;

    const [result] = await db.promise().query(
      `INSERT INTO notifications 
      (userId, title, message, type, notificationType, relatedCropId, actionUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        message,
        type,
        notificationType,
        relatedCropId,
        actionUrl,
      ]
    );

    res.json({
      success: true,
      message: "Notification created",
      notificationId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// MARK AS READ
// ===============================
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    await db.promise().query(
      "UPDATE notifications SET isRead = true WHERE id = ? AND userId = ?",
      [notificationId, userId]
    );

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// MARK ALL AS READ
// ===============================
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.promise().query(
      "UPDATE notifications SET isRead = true WHERE userId = ?",
      [userId]
    );

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// DELETE NOTIFICATION
// ===============================
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    await db.promise().query(
      "DELETE FROM notifications WHERE id = ? AND userId = ?",
      [notificationId, userId]
    );

    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// EMAIL SUBSCRIPTIONS
// ===============================
exports.updateEmailSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      weatherAlerts,
      irrigationReminders,
      fertilizerReminders,
      harvestNotifications,
      taskReminders,
    } = req.body;

    await db.promise().query(
      `INSERT INTO emailSubscriptions 
      (userId, weatherAlerts, irrigationReminders, fertilizerReminders, harvestNotifications, taskReminders)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      weatherAlerts = VALUES(weatherAlerts),
      irrigationReminders = VALUES(irrigationReminders),
      fertilizerReminders = VALUES(fertilizerReminders),
      harvestNotifications = VALUES(harvestNotifications),
      taskReminders = VALUES(taskReminders)`,
      [
        userId,
        weatherAlerts,
        irrigationReminders,
        fertilizerReminders,
        harvestNotifications,
        taskReminders,
      ]
    );

    res.json({ success: true, message: "Preferences updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
