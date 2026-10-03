import tokenHandler from "../utils/tokenHandler.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = tokenHandler.extractToken(req.headers);
    const jwtDecoded = tokenHandler.verifyToken(token);
    await tokenHandler.bindUserToRequest(req, jwtDecoded.userId);
    return next();
  } catch {
    return res.status(401).json({
      message: "Authentification requise",
    });
  }
};

export const checkRole = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentification requise" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Autorisation requise" });
    }
    return next();
  };
};
