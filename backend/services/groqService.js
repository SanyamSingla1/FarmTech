// services/groqService.js
const axios = require("axios");

exports.getCropRecommendation = async (soil, location) => {
  const prompt = `
  Suggest best crops for:
  Soil: ${soil}
  Location: ${location}
  Include season + reason.
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

  return res.data.choices[0].message.content;
};