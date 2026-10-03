import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoutes.js";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const apiBase = process.env.API_BASE_URL;

app.use(`${apiBase}/auth`, authRoute);

export default app;
