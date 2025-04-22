const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

// API Route
app.post("/get-country-info", async (req, res) => {
  const { country } = req.body;

  try {
    const response = await axios.post(
      TOGETHER_API_URL,
      {
        model: "meta-llama/Llama-3-70b-chat-hf",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides detailed country information.",
          },
          {
            role: "user",
            content: `Give me detailed, updated information about ${country}.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const countryInfo = response.data.choices[0].message.content;
    res.json({ info: countryInfo });
  } catch (err) {
    console.error("Error from Together API:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get info from AI" });
  }
});

// Serve static HTML
app.use(express.static("public"));

// Start server
app.listen(3000, () => {
  console.log("🌐 Server running at http://localhost:3000");
});
