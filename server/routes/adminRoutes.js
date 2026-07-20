import { Router } from "express";
import {
  deleteBooking,
  getBookings,
  getContacts,
  updateBooking,
  updateContact,
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAdmin);

router.get("/bookings", getBookings);
router.patch("/bookings/:id", updateBooking);
router.delete("/bookings/:id", deleteBooking);
router.get("/contacts", getContacts);
router.patch("/contacts/:id", updateContact);

export default router;
