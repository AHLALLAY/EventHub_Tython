import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const error = new Error("Email ou mot de passe incorrect");
      error.statusCode = 401;
      throw error;
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      const error = new Error("Email ou mot de passe incorrect");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async me(userId) {
    const user = prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      const error = new Error("Utilisateur introuvable");
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}
export default new AuthService();
