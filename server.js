import express from "express";
import fetch from "node-fetch";
import cors from "cors";

console.log("🚀 Starting PrizePool backend with REST mode only");


const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Helius API key
const HELIUS_API_KEY = "f82d4717-bccc-4000-87c9-9058dd0e19e3";

// Use REST balances API, not RPC
app.get("/balance/:wallet/:mint", async (req, res) => {
  const { wallet, mint } = req.params;

  try {
    const url = `https://api.helius.xyz/v0/addresses/${wallet}/balances?api-key=${HELIUS_API_KEY}`;
    console.log("Fetching:", url);

    const response = await fetch(url);
    const data = await response.json();

    // Debug log
    console.log("Helius response:", data);

    if (!data.tokens) {
      return res.json({ balance: 0 });
    }

    const token = data.tokens.find((t) => t.mint === mint);

    if (token) {
      const balance = token.amount / Math.pow(10, token.decimals);
      return res.json({ balance });
    } else {
      return res.json({ balance: 0 });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
