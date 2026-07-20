import crypto from "node:crypto";
import { getDatabaseDriver } from "../config/database.js";
import {
  getJsonDatabase,
  persistJsonDatabase,
} from "../config/jsonDatabase.js";
import { Admin } from "../models/Admin.js";
import { normalizeMongoDocument } from "./helpers.js";

export const findAdminByEmail = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (getDatabaseDriver() === "mongodb") {
    const admin = await Admin.findOne({ email: normalizedEmail }).lean();
    return normalizeMongoDocument(admin);
  }

  return (
    getJsonDatabase().admins.find(
      (admin) => admin.email.toLowerCase() === normalizedEmail,
    ) || null
  );
};

export const upsertAdmin = async ({ name, email, passwordHash }) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (getDatabaseDriver() === "mongodb") {
    const admin = await Admin.findOneAndUpdate(
      { email: normalizedEmail },
      { name, email: normalizedEmail, passwordHash, role: "admin" },
      { new: true, upsert: true, runValidators: true },
    ).lean();

    return normalizeMongoDocument(admin);
  }

  const database = getJsonDatabase();
  const existingIndex = database.admins.findIndex(
    (admin) => admin.email.toLowerCase() === normalizedEmail,
  );
  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    database.admins[existingIndex] = {
      ...database.admins[existingIndex],
      name,
      email: normalizedEmail,
      passwordHash,
      updatedAt: now,
    };
    await persistJsonDatabase();
    return database.admins[existingIndex];
  }

  const admin = {
    id: crypto.randomUUID(),
    name,
    email: normalizedEmail,
    passwordHash,
    role: "admin",
    createdAt: now,
    updatedAt: now,
  };

  database.admins.push(admin);
  await persistJsonDatabase();
  return admin;
};
