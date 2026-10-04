import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoutes.js";
import eventRoute from "./routes/eventRoutes.js";
import "dotenv/config";
import participantRoute from "./routes/participantRoutes.js";
import registrationRoute from "./routes/registrationRoutes.js";
import statisticsRoute from "./routes/statisticsRoutes.js";

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
app.use(`${apiBase}/events`, eventRoute);
app.use(`${apiBase}/participants`, participantRoute);
app.use(`${apiBase}/registrations`, registrationRoute);
app.use(`${apiBase}/dashboard/stats`, statisticsRoute);

export default app;
