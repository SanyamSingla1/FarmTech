// services/fertilizerAI.service.js
const axios = require("axios");

exports.getFertilizerRecommendation = async (data) => {
  const prompt = `
You are an agricultural fertilizer expert AI.

Input:
- Crop: ${data.crop}
- Soil: ${data.soil}
- Location: ${data.location}

Provide fertilizer recommendations specific to this crop and the provided soil/location.
Do not return the same generic fertilizer advice for every crop.

Return STRICT JSON only with this structure:
{
  "fertilizers": [
    {
      "name": "",
      "quantity": "",
      "timing": "",
      "reason": ""
    }
  ],
  "warning": ""
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