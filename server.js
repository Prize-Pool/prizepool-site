import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend requests
app.use(cors());

// Helius RPC URL (replace with your API key)
const HELIUS_URL = "https://mainnet.helius-rpc.com/?api-key=f82d4717-bccc-4000-87c9-9058dd0e19e3";

// Health check
app.get("/ping", (req, res) => {
  res.json({ msg: "pong" });
});

// Balance endpoint
app.get("/balance/:wallet/:mint", async (req, res) => {
  const { wallet, mint } = req.params;

  try {
    const body = {
      jsonrpc: "2.0",
      id: "1",
      method: "getTokenAccountsByOwner",
      params: [
        wallet,
        { mint },
        { encoding: "jsonParsed" }
      ],
    };

    const response = await fetch(HELIUS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.result?.value?.length > 0) {
      const account = data.result.value[0].account.data.parsed.info;
      const balance = account.tokenAmount.uiAmount;

      return res.json({ balance });
    }

    res.json({ balance: 0 });
  } catch (err) {
    console.error("Error fetching balance:", err);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
