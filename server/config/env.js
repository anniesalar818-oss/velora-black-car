import dotenv from "dotenv";

dotenv.config({ quiet: true });

const booleanFromEnv = (value, fallback = false) => {
  if (value === undefined || value === "") return fallback;
  return String(value).toLowerCase() === "true";
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  storageDriver: ["json", "mongodb", "supabase"].includes(
  String(process.env.STORAGE_DRIVER || "").toLowerCase()
)
  ? String(process.env.STORAGE_DRIVER).toLowerCase()
  : "json",
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret:
    process.env.JWT_SECRET ||
    "development-only-secret-change-before-deploying-velora",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "12h",
  cookieName: process.env.COOKIE_NAME || "velora_admin_token",
  cookieSecure: booleanFromEnv(
    process.env.COOKIE_SECURE,
    process.env.NODE_ENV === "production",
  ),
  adminEmail: process.env.ADMIN_EMAIL || "admin@velora.local",
  adminPassword: process.env.ADMIN_PASSWORD || "VeloraAdmin2026!",
  adminName: process.env.ADMIN_NAME || "Velora Administrator",
  paymentCurrency: (process.env.PAYMENT_CURRENCY || "usd").toLowerCase(),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  emailHost: process.env.EMAIL_HOST || "",
  emailPort: Number(process.env.EMAIL_PORT || 465),
  emailSecure: booleanFromEnv(process.env.EMAIL_SECURE, true),
  emailUser: process.env.EMAIL_USER || "",
  emailAppPassword: process.env.EMAIL_APP_PASSWORD || "",
  emailFrom:
    process.env.EMAIL_FROM || "Velora Black Car <no-reply@velora.local>",
  adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || "",
};

export const isProduction = env.nodeEnv === "production";
