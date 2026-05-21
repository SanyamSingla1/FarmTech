const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { cropRecommend } = require("../controllers/aiController");

router.post("/crop", auth, cropRecommend);

module.exports = router;