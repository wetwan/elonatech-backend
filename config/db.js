import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Could not connect to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
