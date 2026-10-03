import express from "express";
import {
  createEvent,
  getAllEvents,
  getOneEvent,
  updateEvent,
  updateEventStatus,
} from "../controllers/eventController.js";
import { checkRole, isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/", isAuthenticated, checkRole("admin", "staff"), createEvent);
router.get("/", isAuthenticated, checkRole("admin", "staff"), getAllEvents);
router.get("/:id", isAuthenticated, checkRole("admin", "staff"), getOneEvent);
router.put("/:id", isAuthenticated, checkRole("admin", "staff"), updateEvent);
router.patch(
  "/:id/status",
  isAuthenticated,
  checkRole("admin", "staff"),
  updateEventStatus,
);

export default router;
