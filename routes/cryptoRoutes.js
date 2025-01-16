import express from "express";
import Crypto from "../models/Crypto.js";

const router = express.Router();

router.get("/cryptos", async (req, res) => {
  try {
    const cryptos = await Crypto.find();
    res.json(cryptos);
  } catch (error) {
    res.status(500).send("Error retrieving data");
  }
});

router.get("/stats", async (req, res) => {
  const { coin } = req.query;
  if (!coin || !["bitcoin", "matic-network", "ethereum"].includes(coin)) {
    return res.status(400).json({ error: "Invalid or missing coin parameter" });
  }

  try {
    const crypto = await Crypto.findOne({
      name: coin.charAt(0).toUpperCase() + coin.slice(1).replace("-", " "),
    });
    if (!crypto) {
      return res.status(400).json({ error: "Cryptocurrency data not found" });
    }
    res.json({
      price: crypto.price_usd,
      marketCap: crypto.market_cap_usd,
      "24hChange": crypto.change_24h,
    });
  } catch (error) {
    res.status(500).send("Error retrieving data");
  }
});

router.get("/deviation", async (req, res) => {
  const { coin } = req.query;
  if (!coin || !["bitcoin", "matic-network", "ethereum"].includes(coin)) {
    return res.status(400).json({ error: "Invalid or missing parameter" });
  }

  try {
    const records = await Crypto.find({
      name: coin.charAt(0).toUpperCase() + coin.slice(1).replace("-", " "),
    })
      .sort({ last_updated: -1 })
      .limit(100);
    if (records.length === 0) {
      return res
        .status(400)
        .json({ error: "No records found for the requested cryptocurrency" });
    }
    const prices = records.map((record) => record.price_usd);
    const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
    const variance =
      prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) /
      prices.length;
    const standardDeviation = Math.sqrt(variance).toFixed(2);

    res.json({ deviation: parseFloat(standardDeviation) });
  } catch (error) {
    res.status(500).send("Error calculating deviation");
  }
});

export default router;
