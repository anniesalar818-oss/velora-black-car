import { Router } from "express";
import {
  createBooking,
  getQuote,
  lookupBooking,
} from "../controllers/bookingController.js";

const router = Router();

router.post("/quote", getQuote);
router.post("/lookup", lookupBooking);
router.post("/", createBooking);

export default router;
