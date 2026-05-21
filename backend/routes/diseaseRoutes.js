const router = require("express").Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const {
  detectDisease,
} = require("../controllers/diseaseController");

router.post(
  "/detect",
  upload.single("image"),
  detectDisease
);

module.exports = router;