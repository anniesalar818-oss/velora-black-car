import crypto from "node:crypto";

export const createBookingReference = () => {
  const now = new Date();
  const date = [
    String(now.getUTCFullYear()).slice(-2),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
  ].join("");
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `VEL-${date}-${suffix}`;
};
