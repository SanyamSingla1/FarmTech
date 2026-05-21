// controllers/userController.js
const db = require("../config/db");

// GET PROFILE
exports.getProfile = async (req, res) => {
  const [user] = await db.query(
    "SELECT id, username, email, land_size, soil_type, location FROM users WHERE id=?",
    [req.user.id]
  );

  res.json(user[0]);
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const { username, email, land_size, soil_type, location } = req.body;

  await db.query(
    `UPDATE users 
     SET username=?, email=?, land_size=?, soil_type=?, location=? 
     WHERE id=?`,
    [username, email, land_size, soil_type, location, req.user.id]
  );

  res.json({ message: "Profile updated successfully" });
};