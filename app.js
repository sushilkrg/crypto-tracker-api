import express from "express";
import mongoose from "mongoose";
import cron from "node-cron";
import dotenv from "dotenv";
import fetchCryptoData from "./jobs/fetchCryptoData.js";
import cryptoRoutes from "./routes/cryptoRoutes.js";

dotenv.config();

const app = express();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use("/api", cryptoRoutes);
cron.schedule("0 */2 * * *", fetchCryptoData);
fetchCryptoData();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
