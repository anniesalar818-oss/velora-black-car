import Stripe from "stripe";
import { env } from "../config/env.js";
import {
  findBookingRecordById,
  updateBookingRecord,
} from "../repositories/bookingRepository.js";

let stripeClient;

const getStripe = () => {
  if (!env.stripeSecretKey) return null;
  if (!stripeClient) stripeClient = new Stripe(env.stripeSecretKey);
  return stripeClient;
};

const requireStripe = () => {
  const stripe = getStripe();
  if (!stripe) {
    const error = new Error(
      "Card payments are not configured yet. Please select Pay Later.",
    );
    error.status = 503;
    throw error;
  }
  return stripe;
};

const markSessionPaid = async (session) => {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return null;

  return updateBookingRecord(bookingId, {
    paymentStatus: "paid",
    stripeSessionId: session.id,
    status: "confirmed",
  });
};

export const createCheckoutSession = async (req, res) => {
  const stripe = requireStripe();
  const bookingId = String(req.body.bookingId || "").trim();

  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: "Booking ID is required.",
    });
  }

  const booking = await findBookingRecordById(bookingId);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found.",
    });
  }

  if (booking.paymentStatus === "paid") {
    return res.status(409).json({
      success: false,
      message: "This booking is already paid.",
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: booking.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: env.paymentCurrency,
          unit_amount: Math.round(Number(booking.price.total) * 100),
          product_data: {
            name: `Velora reservation ${booking.reference}`,
            description: `${booking.price.vehicleLabel || booking.vehicleType} — ${booking.pickupAddress}`,
          },
        },
      },
    ],
    metadata: {
      bookingId: booking.id,
      bookingReference: booking.reference,
    },
    success_url: `${env.clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.clientUrl}/booking?payment=cancelled&reference=${encodeURIComponent(booking.reference)}`,
  });

  await updateBookingRecord(booking.id, { stripeSessionId: session.id });

  res.json({
    success: true,
    checkoutUrl: session.url,
  });
};

export const getCheckoutSession = async (req, res) => {
  const stripe = requireStripe();
  const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

  let booking = null;
  if (session.payment_status === "paid") {
    booking = await markSessionPaid(session);
  }

  res.json({
    success: true,
    paymentStatus: session.payment_status,
    booking,
  });
};

export const stripeWebhook = async (req, res) => {
  const stripe = requireStripe();
  let event;

  if (env.stripeWebhookSecret) {
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      env.stripeWebhookSecret,
    );
  } else {
    event = JSON.parse(req.body.toString("utf8"));
  }

  if (event.type === "checkout.session.completed") {
    await markSessionPaid(event.data.object);
  }

  res.json({ received: true });
};
