import { Router } from "express";
import {
  createCheckoutSession,
  getCheckoutSession,
} from "../controllers/paymentController.js";

const router = Router();
router.post("/checkout", createCheckoutSession);
router.get("/session/:sessionId", getCheckoutSession);

export default router;
