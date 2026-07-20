import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import paymentWebhookRoutes from "./routes/paymentWebhookRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import { ensureAdminAccount } from "./services/adminSetupService.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

// Stripe needs the untouched request body, so this route must be before express.json().
app.use("/api/payments/webhook", paymentWebhookRoutes);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please wait and try again.",
  },
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "Velora Black Car API",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/public", publicRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDatabase();
    await ensureAdminAccount();

    app.listen(env.port, () => {
      console.log(`Velora API running at http://localhost:${env.port}`);
      console.log(`Allowed client: ${env.clientUrl}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

start();
