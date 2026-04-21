require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api", require("./routes/auth"));
app.use("/api/weather", require("./routes/weather"));
app.use("/api/ai", require("./routes/ai"));

const PORT = process.env.PORT || 5000;
console.log("GROQ KEY:", process.env.GROQ_API_KEY?.slice(0, 10));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});