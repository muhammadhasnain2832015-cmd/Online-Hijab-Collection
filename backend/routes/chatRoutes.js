const express = require("express");
const router = express.Router();
// Trigger nodemon restart
const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
const SYSTEM_PROMPT = `You are a helpful and friendly customer support assistant for "Hijab Collection" — an online hijab store based in Pakistan.

Your job is to help customers with:
- Product information (chiffon, jersey, silk, printed hijabs)
- Pricing (products range from Rs. 650 to Rs. 2000)
- Sizes available (Small, Medium, Large, Extra Large)
- Shipping (free delivery on orders above Rs. 1500, otherwise Rs. 200)
- Return policy (7-day easy returns)
- Payment methods (Cash on Delivery, Bank Transfer, Easypaisa/JazzCash)
- Order tracking (tell them to check My Orders page after login)
- Care instructions for hijabs
- How to place an order
- General hijab styling tips

Rules:
- Always be polite, warm and helpful
- Keep replies short and clear (2-4 sentences max)
- If asked something outside hijab store topics, politely say you can only help with store-related questions
- Always respond in the same language the customer writes in (Urdu or English)
- If customer writes in Urdu, reply in Urdu
- Never make up information you don't know
- End responses with a helpful follow-up offer when relevant`;

router.post("/", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      console.log("Returning 400: Invalid messages array");
      return res.status(400).json({ message: "Messages array is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing in .env");
      return res.status(500).json({ message: "API key not configured" });
    }

    console.log("Sending to Groq, messages count:", messages.length);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    console.log("Groq reply success!");
    res.json({ reply });

  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({
      message: "Sorry, I am unable to respond right now. Please try again.",
    });
  }
});

module.exports = router;