const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.DEEPSEEK_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: req.body.messages,
      }),
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});