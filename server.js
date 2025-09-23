import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
const app = express();
import dotenv from "dotenv";

dotenv.config();
// connect to db
await connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API Working"));
app.use(express.raw({ type: "application/json" }));

const PORT = 5000;
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
