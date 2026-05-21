const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  recommendFertilizer,
} = require("../controllers/fertilizerController");

router.post("/recommend", auth, recommendFertilizer);

module.exports = router;