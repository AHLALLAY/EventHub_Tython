import express from "express";
import { checkRole, isAuthenticated } from "../middlewares/authMiddleware.js";
import { createUser, getUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/", isAuthenticated, checkRole("admin"), createUser);
router.get("/", isAuthenticated, checkRole("admin"), getUsers);

export default router;
