import { loginSchema } from "../schemas/authSchema.js";
import authService from "../services/authService.js";

export const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Données invalides",
        errors: parsed.error.issues.map((i) => i.message),
      });
    }
    const { email, password } = parsed.data;
    const data = await authService.login(email, password);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

export const me = async (req, res) => {
  return res.status(200).json(req.user);
};
