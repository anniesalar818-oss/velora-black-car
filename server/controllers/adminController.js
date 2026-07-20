import {
  deleteBookingRecord,
  listBookingRecords,
  updateBookingRecord,
} from "../repositories/bookingRepository.js";
import {
  listContactRecords,
  updateContactRecord,
} from "../repositories/contactRepository.js";
import {
  bookingUpdateSchema,
  contactUpdateSchema,
} from "../services/validationSchemas.js";

const createStats = (bookings) => ({
  total: bookings.length,
  pending: bookings.filter((item) => item.status === "pending").length,
  confirmed: bookings.filter((item) => item.status === "confirmed").length,
  completed: bookings.filter((item) => item.status === "completed").length,
  paid: bookings.filter((item) => item.paymentStatus === "paid").length,
  revenue: bookings
    .filter((item) => item.paymentStatus === "paid")
    .reduce((sum, item) => sum + Number(item.price?.total || 0), 0),
});

export const getBookings = async (req, res) => {
  const filters = {
    status: String(req.query.status || ""),
    paymentStatus: String(req.query.paymentStatus || ""),
    search: String(req.query.search || ""),
  };

  const bookings = await listBookingRecords(filters);
  const allBookings =
    filters.status || filters.paymentStatus || filters.search
      ? await listBookingRecords()
      : bookings;

  res.json({
    success: true,
    bookings,
    stats: createStats(allBookings),
  });
};

export const updateBooking = async (req, res) => {
  const updates = bookingUpdateSchema.parse(req.body);
  const booking = await updateBookingRecord(req.params.id, updates);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found.",
    });
  }

  return res.json({ success: true, booking });
};

export const deleteBooking = async (req, res) => {
  const booking = await deleteBookingRecord(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found.",
    });
  }

  return res.json({ success: true });
};

export const getContacts = async (req, res) => {
  const messages = await listContactRecords();
  res.json({ success: true, messages });
};

export const updateContact = async (req, res) => {
  const updates = contactUpdateSchema.parse(req.body);
  const message = await updateContactRecord(req.params.id, updates);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Message not found.",
    });
  }

  return res.json({ success: true, message });
};
