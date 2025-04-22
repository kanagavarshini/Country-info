const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TOGETHER_API_URL = "https://api.together.xyz/inference";
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

app.post("/get-country-info", async (req, res) => {
  const { country } = req.body;
  const prompt = `Give me detailed, updated information about ${country}.`;

  try {
    const response = await axios.post(
      TOGETHER_API_URL,
      {
        model: "togethercomputer/llama-2-70b-chat",
        prompt,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
        },
      }
    );

    const countryInfo = response.data.output;
    res.json({ info: countryInfo });
  } catch (err) {
    console.error("Error from Together API:", err.message);
    res.status(500).json({ error: "Failed to get info from AI" });
  }
});

app.use(express.static("public"));

app.listen(3000, () => console.log("Server running on port 3000"));
