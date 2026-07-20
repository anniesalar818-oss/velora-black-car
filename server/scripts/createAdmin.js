import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import { ensureAdminAccount } from "../services/adminSetupService.js";

try {
  await connectDatabase();
  await ensureAdminAccount({ forcePasswordUpdate: true });
  console.log(`Login email: ${env.adminEmail}`);
  console.log("Admin password was read from ADMIN_PASSWORD in server/.env");
  await disconnectDatabase();
  process.exit(0);
} catch (error) {
  console.error("Could not create admin:", error.message);
  process.exit(1);
}
