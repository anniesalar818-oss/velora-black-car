import { createContactRecord } from "../repositories/contactRepository.js";
import { sendContactNotification } from "../services/emailService.js";
import { contactSchema } from "../services/validationSchemas.js";

export const createContactMessage = async (req, res) => {
  const data = contactSchema.parse(req.body);
  const message = await createContactRecord({
    ...data,
    email: data.email.toLowerCase(),
  });

  try {
    await sendContactNotification(message);
  } catch (emailError) {
    console.error("Contact message saved, but email failed:", emailError.message);
  }

  res.status(201).json({
    success: true,
    message: "Thank you. Our concierge team will contact you shortly.",
  });
};
