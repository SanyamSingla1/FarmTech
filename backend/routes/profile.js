const express = require("express");
const router = express.Router();

const profile = require("../controllers/profileController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, profile.getProfile);
router.put("/", auth, profile.updateProfile);

module.exports = router;