import express from "express";
import { getDashboardStats } from "../controllers/statisticsController.js";
import { checkRole, isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  checkRole("admin", "staff"),
  getDashboardStats,
);

export default router;
