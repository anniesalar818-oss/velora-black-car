import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import {
  findAdminByEmail,
  upsertAdmin,
} from "../repositories/adminRepository.js";

export const ensureAdminAccount = async ({ forcePasswordUpdate = false } = {}) => {
  const existing = await findAdminByEmail(env.adminEmail);

  if (existing && !forcePasswordUpdate) return existing;

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  const admin = await upsertAdmin({
    name: env.adminName,
    email: env.adminEmail,
    passwordHash,
  });

  console.log(`Admin account ready: ${admin.email}`);
  return admin;
};
