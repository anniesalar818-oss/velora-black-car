import { env } from "../config/env.js";
import { verifyAdminToken } from "../services/tokenService.js";

export const requireAdmin = (req, res, next) => {
  const authorization = req.get("authorization") || "";
  const bearerToken = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";
  const token = req.cookies?.[env.cookieName] || bearerToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Admin login required.",
    });
  }

  try {
    const payload = verifyAdminToken(token);
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Your admin session has expired. Please log in again.",
    });
  }
};
