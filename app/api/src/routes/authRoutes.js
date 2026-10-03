import express from "express";
import { login, me } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", isAuthenticated, me);

export default router;
