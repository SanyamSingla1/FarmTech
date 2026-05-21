const db = require("../config/db");

const addCropCycle = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      crop_name,
      sowing_date,
      harvest_date,
      location,
      soil_type,
    } = req.body;

    await db.query(
      `
      INSERT INTO crop_cycles
      (user_id, crop_name, sowing_date, harvest_date, location, soil_type)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        crop_name,
        sowing_date,
        harvest_date,
        location,
        soil_type,
      ]
    );

    res.json({
      success: true,
      message: "Crop cycle created successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to add crop cycle",
    });
  }
};

module.exports = { addCropCycle };