// services/aiAdvice.service.js

const axios = require("axios");

exports.getAIAdvice = async (crop, stage, weather) => {
  const prompt = `
You are an expert farming AI.

Crop: ${crop}
Stage: ${stage}
Weather: ${weather.main.temp}°C

Give:
- irrigation advice
- fertilizer advice
- pest risk
- warnings if any
- keep points very short, concise and actionable
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