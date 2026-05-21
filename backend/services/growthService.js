// services/growthService.js
const axios = require("axios");

exports.predictGrowthTimeline = async (data) => {
  const prompt = `
You are an agricultural AI expert.

Predict crop growth timeline:

Crop: ${data.crop}
Soil: ${data.soil}
Location: ${data.location}
Planting Date: ${data.planting_date}
Current Weather: ${data.weather}

Return STRICT JSON:
{
  "stages": [
    { "stage": "Germination", "days": "0-10" },
    { "stage": "Vegetative", "days": "10-40" },
    { "stage": "Flowering", "days": "40-70" },
    { "stage": "Harvest", "days": "70-100" }
  ],
  "risk_alerts": ["drought risk", "pest risk"],
  "irrigation_plan": "text recommendation"
}
`;

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_KEY}`,
      },
    }
  );

  return JSON.parse(res.data.choices[0].message.content);
};