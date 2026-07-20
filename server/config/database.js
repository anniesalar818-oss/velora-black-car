import mongoose from "mongoose";
import { env } from "./env.js";
import { initializeJsonDatabase } from "./jsonDatabase.js";
import supabase from "./supabase.js";
let activeDriver = "json";

export const connectDatabase = async () => {
   if (env.storageDriver === "supabase") {
    const { error } = await supabase
      .from("bookings")
      .select("id")
      .limit(1);

    if (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }

    activeDriver = "supabase";
    console.log("Database connected: Supabase");
    return activeDriver;
  }
  if (env.storageDriver === "mongodb") {
    if (!env.mongoUri) {
      throw new Error(
        "STORAGE_DRIVER is mongodb but MONGODB_URI is empty in server/.env",
      );
    }

    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });

    activeDriver = "mongodb";
    console.log(`Database connected: MongoDB (${mongoose.connection.name})`);
    return activeDriver;
  }

  await initializeJsonDatabase();
  activeDriver = "json";
  console.log("Database connected: local JSON (server/data/db.json)");
  return activeDriver;
};

export const getDatabaseDriver = () => activeDriver;

export const disconnectDatabase = async () => {
  if (activeDriver === "mongodb") {
    await mongoose.disconnect();
  }
};
