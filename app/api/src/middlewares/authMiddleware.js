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
