import express from "express";
import { checkRole, isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  createParticipant,
  getParticipants,
  updateParticipant,
} from "../controllers/participantController.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  checkRole("admin", "staff"),
  createParticipant,
);
router.get("/", isAuthenticated, checkRole("admin", "staff"), getParticipants);
router.put(
  "/:id",
  isAuthenticated,
  checkRole("admin", "staff"),
  updateParticipant,
);

export default router;
