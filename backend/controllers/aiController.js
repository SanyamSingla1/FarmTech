const groq = require("../config/groq");

exports.getCropRecommendation = async (req, res) => {
  try {
    const { soil, location, weather, farmSize } = req.body;

    // ✅ validation
    if (!soil || !location) {
      return res.status(400).json({
        error: "soil and location are required",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `
You are an agriculture AI assistant.

Return ONLY JSON in this format:

{
  "crops": [
    {
      "name": "",
      "reason": "",
      "variety": ""
    }
  ]
}

Rules:
- Only 3 crops
- No extra text
- No explanation outside JSON
- Keep reasons short
          `,
        },
      ],
      temperature: 0.7,
    });

    const result = completion?.choices?.[0]?.message?.content;

    if (!result) {
      return res.status(500).json({
        error: "Empty AI response",
      });
    }

    return res.json({ result });

  } catch (err) {
  console.error("🔥 FULL AI ERROR:", err);

  return res.status(500).json({
    error: "AI failed",
    details: err.message,
    stack: err.stack,
  });
}
};