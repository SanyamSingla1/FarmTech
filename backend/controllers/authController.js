// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { sendEmail } = require("../services/emailService");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password, land_size, soil_type, location } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username,email,password,land_size,soil_type,location) VALUES (?,?,?,?,?,?)",
      [username, email, hashed, land_size, soil_type, location]
    );

    // ✅ Welcome Email (Resend format)
    await sendEmail({
      to: email,
      subject: "Welcome to FarmTech 🌾",
      html: `
        <div style="font-family:Arial">
          <h2>Welcome ${username} 👋</h2>
          <p>Your account has been created successfully.</p>
          <p>Start exploring crop recommendations, weather alerts, and AI insights.</p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "User registered",
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Register server error",
    });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const users = result[0];

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Login Email (Security Alert Style)
    await sendEmail({
      to: user.email,
      subject: "Login Alert 🔐 - FarmTech",
      html: `
        <div style="font-family:Arial">
          <h2>Hello ${user.username}</h2>
          <p>You just logged into your FarmTech account.</p>
          <p>If this wasn't you, please reset your password immediately.</p>
        </div>
      `,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        soil_type: user.soil_type,
        location: user.location,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Login server error",
    });
  }
};