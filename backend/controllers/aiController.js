const axios = require("axios");

const cropRecommend = async (req, res) => {
  try {
    const { soil_type, location, land_size } = req.body;

    const prompt = `You are an expert agricultural AI. Based on the user's farm profile, provide crop recommendations in valid JSON format.

User Farm Profile:
- Soil Type: ${soil_type}
- Location: ${location}
- Land Size: ${land_size} hectares

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "recommended_crops": [
    {
      "crop": "Crop Name",
      "season": "Season when to plant",
      "reason": "Why this crop is suitable",
      "profitability": "low/medium/high",
      "duration": "Months to harvest",
      "yield": "Expected yield amount",
      "benefits": ["benefit1", "benefit2"],
      "yield_per_hectare": "Estimated kg/hectare",
      "profit_potential": "Expected profit range"
    }
  ]
}`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
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
    
    // Try to parse and validate the response
    try {
      const parsed = JSON.parse(recommendation);
      res.json({ recommendation: parsed });
    } catch (parseErr) {
      // If parsing fails, return as string
      console.log("Could not parse AI response as JSON:", parseErr);
      res.json({ recommendation });
    }
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ error: "AI request failed" });
  }
};

module.exports = { cropRecommend };