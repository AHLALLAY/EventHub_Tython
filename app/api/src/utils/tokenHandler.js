import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import "dotenv/config";

class Token {
  extractToken(headers) {
    const auth = headers?.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return null;
    const token = auth.slice("Bearer ".length).trim();
    return token || null;
  }

  /**
   * Vérifie et décode un JWT.
   * @param {string|null} token
   * @returns {object}
   */
  verifyToken(token) {
    if (!token) throw new Error("Token manquant ou invalide");
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  /**
   * Charge l’utilisateur en BDD et l’attache à `req.user`.
   * @param {import('express').Request} req
   * @param {string} userId
   */
  async bindUserToRequest(req, userId) {
    const user = await prisma.user.findUnique({
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
      throw new Error("Utilisateur introuvable ou non autorisé");
    }
    req.user = user;
  }
}

export default new Token();
