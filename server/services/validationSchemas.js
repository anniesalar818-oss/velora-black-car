import { z } from "zod";

const serviceTypes = [
  "airport",
  "point-to-point",
  "hourly",
  "corporate",
  "event",
  "city-tour",
];

const vehicleTypes = [
  "luxury-sedan",
  "luxury-suv",
  "premium-suv",
  "premium-sedan",
  "sprinter-van",
  "executive-coach",
];

const optionalNumber = z.coerce.number().min(0).default(0);

export const quoteSchema = z.object({
  serviceType: z.enum(serviceTypes),
  vehicleType: z.enum(vehicleTypes),
  distanceKm: optionalNumber,
  durationHours: optionalNumber,
  pickupTime: z.string().default("12:00"),
  returnTrip: z.boolean().default(false),
});

export const bookingSchema = quoteSchema.extend({
  customerName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(7).max(30),
  pickupAddress: z.string().trim().min(3).max(300),
  dropoffAddress: z.string().trim().max(300).default(""),
  pickupDate: z.string().min(8).max(20),
  pickupTime: z.string().min(4).max(10),
  returnDate: z.string().max(20).default(""),
  returnTime: z.string().max(10).default(""),
  flightNumber: z.string().trim().max(40).default(""),
  passengers: z.coerce.number().int().min(1).max(56),
  luggage: z.coerce.number().int().min(0).max(56).default(0),
  specialRequests: z.string().trim().max(1000).default(""),
  paymentMethod: z.enum(["pay-later", "card"]).default("pay-later"),
});

export const bookingLookupSchema = z.object({
  reference: z.string().trim().min(6).max(40),
  email: z.string().trim().email(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(200),
});

export const bookingUpdateSchema = z
  .object({
    status: z
      .enum(["pending", "confirmed", "assigned", "completed", "cancelled"])
      .optional(),
    paymentStatus: z.enum(["unpaid", "paid", "refunded"]).optional(),
    specialRequests: z.string().trim().max(1000).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required.",
  });

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(30).default(""),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(2000),
});

export const contactUpdateSchema = z.object({
  status: z.enum(["new", "read", "resolved"]),
});
