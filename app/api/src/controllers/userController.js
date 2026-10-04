import { userSchema } from "../schemas/userSchema.js";
import userService from "../services/userService.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Données invalides",
        errors: parsed.error.issues.map((i) => i.message),
      });
    }
    const { email, password, fullName, role } = parsed.data;
    const passwordHash = await bcrypt.hash(password, 10);
    const data = await userService.createUser({
      email,
      passwordHash,
      fullName,
      role,
    });

    return res.status(201).json(data);
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({
        message: "Cet email est déjà utilisé",
      });
    }
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const data = await userService.getUsers();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};
