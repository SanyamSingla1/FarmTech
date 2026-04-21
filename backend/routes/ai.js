const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getCropRecommendation } = require("../controllers/aiController");

router.post("/", auth, getCropRecommendation);

module.exports = router;