const axios = require("axios");

const recommendFertilizer = async (req, res) => {
  try {
    const { crop, soil_type, location } = req.body;

    if (!crop) {
      return res.status(400).json({
        message: "Crop name is required",
      });
    }

    const prompt = `
You are an agricultural fertilizer expert AI.

Input:
- Crop: ${crop}
- Soil Type: ${soil_type || "Unknown"}
- Location: ${location || "Unknown"}

Provide fertilizer recommendations that are specific to this crop and the given soil/location conditions. Do not return a generic fertilizer recommendation that applies to all crops.

Return ONLY valid JSON in this exact structure:
{
  "fertilizers": [
    {
      "name": "",
      "description": "",
      "usage": "",
      "nutrient_ratio": "",
      "application_rate": "",
      "benefits": [""],
      "precautions": [""]
    }
  ]
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
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let recommendation = response.data.choices[0].message.content;

    const tryParseJson = (text) => {
      if (typeof text !== "string") return text;
      const trimmed = text.trim();
      try {
        return JSON.parse(trimmed);
      } catch {
        return null;
      }
    };

    const extractJson = (text) => {
      if (typeof text !== "string") return text;
      const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
      if (fenced) {
        const parsed = tryParseJson(fenced[1]);
        if (parsed) return parsed;
      }

      const objectMatch = text.match(/(\{[\s\S]*\})/);
      if (objectMatch) {
        const parsed = tryParseJson(objectMatch[1]);
        if (parsed) return parsed;
      }

      return text;
    };

    recommendation = extractJson(recommendation);

    res.json({ recommendation });
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      message: "Fertilizer recommendation failed",
    });
  }
};

module.exports = { recommendFertilizer };