import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

const getTransporter = () => {
  if (!env.emailHost || !env.emailUser || !env.emailAppPassword) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.emailHost,
      port: env.emailPort,
      secure: env.emailSecure,
      auth: {
        user: env.emailUser,
        pass: env.emailAppPassword,
      },
    });
  }

  return transporter;
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const bookingEmailHtml = (booking) => `
  <div style="font-family:Arial,sans-serif;background:#110f0e;padding:32px;color:#f5e7d7">
    <div style="max-width:640px;margin:auto;background:#1b1715;border:1px solid #5b4432;border-radius:20px;overflow:hidden">
      <div style="background:#c99a68;padding:24px 32px;color:#17110d">
        <h1 style="margin:0;font-size:28px">VELORA</h1>
        <p style="margin:6px 0 0">Premium Black Car Service</p>
      </div>
      <div style="padding:32px">
        <h2 style="margin-top:0">Booking request received</h2>
        <p>Hello ${escapeHtml(booking.customerName)},</p>
        <p>Thank you for choosing Velora. Your reservation request has been received and our concierge team will confirm availability shortly.</p>
        <div style="background:#100e0d;border-radius:14px;padding:20px;margin:24px 0">
          <p><strong>Reference:</strong> ${escapeHtml(booking.reference)}</p>
          <p><strong>Pickup:</strong> ${escapeHtml(booking.pickupAddress)}</p>
          <p><strong>Drop-off:</strong> ${escapeHtml(booking.dropoffAddress || "Hourly service")}</p>
          <p><strong>Date & time:</strong> ${escapeHtml(booking.pickupDate)} at ${escapeHtml(booking.pickupTime)}</p>
          <p><strong>Vehicle:</strong> ${escapeHtml(booking.price.vehicleLabel || booking.vehicleType)}</p>
          <p><strong>Estimated total:</strong> $${Number(booking.price.total).toFixed(2)} USD</p>
          <p><strong>Status:</strong> ${escapeHtml(booking.status)}</p>
        </div>
        <p>Keep your reference number for booking lookup and support.</p>
      </div>
    </div>
  </div>
`;

export const sendBookingConfirmation = async (booking) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.log(`Email skipped (not configured) for booking ${booking.reference}`);
    return { skipped: true };
  }

  const recipients = [booking.email];
  if (env.adminNotificationEmail) recipients.push(env.adminNotificationEmail);

  await mailer.sendMail({
    from: env.emailFrom,
    to: recipients.join(","),
    subject: `Velora booking ${booking.reference}`,
    html: bookingEmailHtml(booking),
  });

  return { skipped: false };
};

export const sendContactNotification = async (message) => {
  const mailer = getTransporter();
  if (!mailer || !env.adminNotificationEmail) return { skipped: true };

  await mailer.sendMail({
    from: env.emailFrom,
    to: env.adminNotificationEmail,
    replyTo: message.email,
    subject: `New Velora enquiry: ${message.subject}`,
    text: `${message.name} (${message.email}, ${message.phone || "no phone"})\n\n${message.message}`,
  });

  return { skipped: false };
};
