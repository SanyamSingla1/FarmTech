// services/diseaseService.js

const axios = require("axios");

exports.analyzeDisease = async (imagePath) => {
  try {
    const prompt = `
You are a plant disease detection AI.

Analyze the plant image path: ${imagePath}

Respond ONLY in JSON format:

{
  "disease": "",
  "confidence": "",
  "cause": "",
  "treatment": "",
  "fertilizer": ""
}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content;

    return JSON.parse(text);

  } catch (error) {
    console.log(error.response?.data || error.message);
    throw new Error("Disease analysis failed");
  }
};