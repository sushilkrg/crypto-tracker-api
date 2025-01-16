import mongoose from "mongoose";

const cryptoSchema = new mongoose.Schema({
  name: String,
  price_usd: Number,
  market_cap_usd: Number,
  change_24h: Number,
  last_updated: { type: Date, default: Date.now },
});

const Crypto = mongoose.model("Crypto", cryptoSchema);

export default Crypto;
