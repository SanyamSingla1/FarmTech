const axios = require("axios");

const detectDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const prompt = `
Analyze the crop disease image.

Return ONLY valid JSON.

{
  "disease": "",
  "confidence": "",
  "cause": "",
  "symptoms": [],
  "treatment": [],
  "fertilizer": [],
  "prevention": []
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
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let aiText =
      response.data.choices[0].message.content;

    //console.log("RAW AI:", aiText);

    // remove markdown
    aiText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedData;

    try {
      parsedData = JSON.parse(aiText);
    } catch (parseError) {
      console.log("JSON Parse Error:", parseError);

      parsedData = {
        disease: "Unknown",
        confidence: "Low",
        cause: aiText,
        symptoms: [],
        treatment: [],
        fertilizer: [],
        prevention: [],
      };
    }

    res.json({
      success: true,
      result: parsedData,
    });
  } catch (error) {
    console.log(
      "Disease Detection Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Disease detection failed",
    });
  }
};

module.exports = { detectDisease };