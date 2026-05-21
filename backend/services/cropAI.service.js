// services/cropAI.service.js
const axios = require("axios");

exports.getCropRecommendation = async (user) => {
  const prompt = `
You are an expert agricultural AI.

User Data:
- Soil Type: ${user.soil_type}
- Location: ${user.location}
- Land Size: ${user.land_size} hectares

Return STRICT JSON:
{
  "recommended_crops": [
    {
      "crop": "",
      "season": "",
      "reason": "",
      "profitability": "low/medium/high"
    }
  ]
}
`;

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_KEY}`,
      },
    }
  );

  return JSON.parse(res.data.choices[0].message.content);
};