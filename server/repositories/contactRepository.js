import crypto from "node:crypto";
import { getDatabaseDriver } from "../config/database.js";
import {
  getJsonDatabase,
  persistJsonDatabase,
} from "../config/jsonDatabase.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { normalizeMongoDocument } from "./helpers.js";

export const createContactRecord = async (data) => {
  if (getDatabaseDriver() === "mongodb") {
    const message = await ContactMessage.create(data);
    return normalizeMongoDocument(message);
  }

  const database = getJsonDatabase();
  const now = new Date().toISOString();
  const message = {
    id: crypto.randomUUID(),
    ...data,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };

  database.contacts.push(message);
  await persistJsonDatabase();
  return message;
};

export const listContactRecords = async () => {
  if (getDatabaseDriver() === "mongodb") {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    return messages.map(normalizeMongoDocument);
  }

  return [...getJsonDatabase().contacts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
};

export const updateContactRecord = async (id, updates) => {
  if (getDatabaseDriver() === "mongodb") {
    const message = await ContactMessage.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();
    return normalizeMongoDocument(message);
  }

  const database = getJsonDatabase();
  const index = database.contacts.findIndex((message) => message.id === id);
  if (index < 0) return null;

  database.contacts[index] = {
    ...database.contacts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await persistJsonDatabase();
  return database.contacts[index];
};
