import axios from "axios";
import Crypto from "../models/Crypto.js";

const fetchCryptoData = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "bitcoin,matic-network,ethereum",
          vs_currencies: "usd",
          include_market_cap: "true",
          include_24hr_change: "true",
        },
      }
    );

    const data = response.data;
    const cryptoData = [
      {
        name: "Bitcoin",
        price_usd: data.bitcoin.usd,
        market_cap_usd: data.bitcoin.usd_market_cap,
        change_24hr: data.bitcoin.usd_24hr_change,
      },
      {
        name: "Matic",
        price_usd: data["matic-network"].usd,
        market_cap_usd: data["matic-network"].usd_market_cap,
        change_24h: data["matic-network"].usd_24h_change,
      },
      {
        name: "Ethereum",
        price_usd: data.ethereum.usd,
        market_cap_usd: data.ethereum.usd_market_cap,
        change_24h: data.ethereum.usd_24h_change,
      },
    ];

    for (const crypto of cryptoData) {
      await Crypto.updateOne(
        { name: crypto.name },
        { $set: crypto },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
};

export default fetchCryptoData;
