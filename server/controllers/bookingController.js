import {
  createBookingRecord,
  findBookingByReferenceAndEmail,
} from "../repositories/bookingRepository.js";
import { sendBookingConfirmation } from "../services/emailService.js";
import { calculateQuote } from "../services/pricingService.js";
import { createBookingReference } from "../services/referenceService.js";
import {
  bookingLookupSchema,
  bookingSchema,
  quoteSchema,
} from "../services/validationSchemas.js";

const validateTripFields = (data) => {
  if (data.serviceType !== "hourly" && !data.dropoffAddress) {
    const error = new Error("Drop-off address is required for this service.");
    error.status = 400;
    throw error;
  }

  if (data.returnTrip && (!data.returnDate || !data.returnTime)) {
    const error = new Error("Return date and return time are required.");
    error.status = 400;
    throw error;
  }
};

export const getQuote = (req, res) => {
  const data = quoteSchema.parse(req.body);
  const quote = calculateQuote(data);
  res.json({ success: true, quote });
};

export const createBooking = async (req, res) => {
  const data = bookingSchema.parse(req.body);
  validateTripFields(data);

  const quote = calculateQuote(data);
  const booking = await createBookingRecord({
    ...data,
    email: data.email.toLowerCase(),
    reference: createBookingReference(),
    status: "pending",
    paymentStatus: "unpaid",
    price: quote,
    stripeSessionId: "",
  });

  try {
    await sendBookingConfirmation(booking);
  } catch (emailError) {
    console.error("Booking saved, but confirmation email failed:", emailError.message);
  }

  res.status(201).json({
    success: true,
    message: "Your booking request has been received.",
    booking,
  });
};

export const lookupBooking = async (req, res) => {
  const data = bookingLookupSchema.parse(req.body);
  const booking = await findBookingByReferenceAndEmail(
    data.reference,
    data.email,
  );

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "No booking matched that reference and email.",
    });
  }

  return res.json({ success: true, booking });
};
