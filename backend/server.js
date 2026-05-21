// server.js
// import dotenv from "dotenv";
// dotenv.config();
require("dotenv").config();
//const app = require("./app");
// app.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/disease", require("./routes/diseaseRoutes"));
app.use("/api/fertilizer", require("./routes/fertilizerRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/weather", require("./routes/weather"));

//module.exports = app;
require("./services/schedulerService");
app.use("/api/crop", require("./routes/cropRoutes"));

require("./jobs/cropAlertJob");
app.listen(5000, () => console.log("Server running on 5000"));