import express from "express";
import {
  createRegistration,
  getRegistrations,
  updateRegistrationStatus,
} from "../controllers/registrationController.js";
import { checkRole, isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  checkRole("admin", "staff"),
  createRegistration,
);
router.get("/", isAuthenticated, checkRole("admin", "staff"), getRegistrations);
router.patch(
  "/:id/status",
  isAuthenticated,
  checkRole("admin", "staff"),
  updateRegistrationStatus,
);

export default router;
