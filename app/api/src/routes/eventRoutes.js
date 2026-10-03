import express from "express";
import { createEvent } from "../controllers/eventController.js";
import { checkRole, isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/", isAuthenticated, checkRole("admin", "staff"), createEvent);

export default router;
