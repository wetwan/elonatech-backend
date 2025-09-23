import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("connected"));
  await mongoose.connect(process.env.MONGODB_URL);
};

export default connectDB;
