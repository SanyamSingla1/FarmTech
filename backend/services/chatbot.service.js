// services/chatbot.service.js
const axios = require("axios");

exports.farmChat = async (message, user) => {
  const prompt = `
You are an expert Farming AI Assistant.

User Context:
- Location: ${user.location}
- Soil: ${user.soil_type}
- Land: ${user.land_size}

Answer clearly, practically, and briefly.
Give the user one or two short sentences.

User Question:
${message}
`;

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_KEY}`,
      },
    }
  );

  return res.data.choices[0].message.content;
};