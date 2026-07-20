import bcrypt from "bcryptjs";
import { env, isProduction } from "../config/env.js";
import { findAdminByEmail } from "../repositories/adminRepository.js";
import { createAdminToken } from "../services/tokenService.js";
import { loginSchema } from "../services/validationSchemas.js";

const publicAdmin = (admin) => ({
  id: admin.id,
  name: admin.name,
  email: admin.email,
  role: admin.role || "admin",
});

const cookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 12 * 60 * 60 * 1000,
  path: "/",
};

export const login = async (req, res) => {
  const credentials = loginSchema.parse(req.body);
  const admin = await findAdminByEmail(credentials.email);

  if (!admin || !(await bcrypt.compare(credentials.password, admin.passwordHash))) {
    return res.status(401).json({
      success: false,
      message: "Email or password is incorrect.",
    });
  }

  const token = createAdminToken(admin);
  res.cookie(env.cookieName, token, cookieOptions);

  return res.json({
    success: true,
    admin: publicAdmin(admin),
  });
};

export const logout = (req, res) => {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.json({ success: true });
};

export const me = (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.admin.sub,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
};
