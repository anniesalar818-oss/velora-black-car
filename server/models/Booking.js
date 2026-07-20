import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
  {
    baseFare: { type: Number, required: true },
    distanceCharge: { type: Number, default: 0 },
    hourlyCharge: { type: Number, default: 0 },
    surcharges: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: "USD" },
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    serviceType: {
      type: String,
      enum: [
        "airport",
        "point-to-point",
        "hourly",
        "corporate",
        "event",
        "city-tour",
      ],
      required: true,
    },
    pickupAddress: { type: String, required: true, trim: true },
    dropoffAddress: { type: String, trim: true, default: "" },
    pickupDate: { type: String, required: true },
    pickupTime: { type: String, required: true },
    returnTrip: { type: Boolean, default: false },
    returnDate: { type: String, default: "" },
    returnTime: { type: String, default: "" },
    flightNumber: { type: String, trim: true, default: "" },
    vehicleType: {
      type: String,
      enum: [
        "luxury-sedan",
        "luxury-suv",
        "premium-suv",
        "premium-sedan",
        "sprinter-van",
        "executive-coach",
      ],
      required: true,
    },
    passengers: { type: Number, required: true, min: 1, max: 56 },
    luggage: { type: Number, default: 0, min: 0, max: 56 },
    distanceKm: { type: Number, default: 0, min: 0 },
    durationHours: { type: Number, default: 0, min: 0 },
    specialRequests: { type: String, trim: true, default: "" },
    paymentMethod: {
      type: String,
      enum: ["pay-later", "card"],
      default: "pay-later",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "assigned", "completed", "cancelled"],
      default: "pending",
    },
    price: { type: priceSchema, required: true },
    stripeSessionId: { type: String, default: "" },
  },
  { timestamps: true },
);

bookingSchema.index({ email: 1, createdAt: -1 });
bookingSchema.index({ status: 1, createdAt: -1 });

export const Booking = mongoose.model("Booking", bookingSchema);
