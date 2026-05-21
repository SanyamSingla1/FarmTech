const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  addCropCycle,
} = require("../controllers/cropController");

router.post("/add", auth, addCropCycle);

module.exports = router;