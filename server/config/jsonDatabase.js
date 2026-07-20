import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const dataDirectory = path.resolve(currentDir, "../data");
const databasePath = path.join(dataDirectory, "db.json");

const emptyDatabase = {
  admins: [],
  bookings: [],
  contacts: [],
};

let database = structuredClone(emptyDatabase);
let writeQueue = Promise.resolve();

const normalizeDatabase = (value = {}) => ({
  admins: Array.isArray(value.admins) ? value.admins : [],
  bookings: Array.isArray(value.bookings) ? value.bookings : [],
  contacts: Array.isArray(value.contacts) ? value.contacts : [],
});

export const initializeJsonDatabase = async () => {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    const raw = await fs.readFile(databasePath, "utf8");
    database = normalizeDatabase(JSON.parse(raw));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    database = structuredClone(emptyDatabase);
    await persistJsonDatabase();
  }
};

export const getJsonDatabase = () => database;

export const persistJsonDatabase = async () => {
  const snapshot = JSON.stringify(database, null, 2);
  const temporaryPath = `${databasePath}.tmp`;

  writeQueue = writeQueue.then(async () => {
    await fs.writeFile(temporaryPath, snapshot, "utf8");
    await fs.rename(temporaryPath, databasePath);
  });

  return writeQueue;
};
