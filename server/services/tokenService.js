import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const createAdminToken = (admin) =>
  jwt.sign(
    {
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role || "admin",
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );

export const verifyAdminToken = (token) => jwt.verify(token, env.jwtSecret);
