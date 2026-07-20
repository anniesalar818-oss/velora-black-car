import crypto from "node:crypto";
import { getDatabaseDriver } from "../config/database.js";
import {
  getJsonDatabase,
  persistJsonDatabase,
} from "../config/jsonDatabase.js";
import { Booking } from "../models/Booking.js";
import { normalizeMongoDocument } from "./helpers.js";
import supabase from "../config/supabase.js";
const sortNewestFirst = (a, b) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export const createBookingRecord = async (data) => {
  if (getDatabaseDriver() === "supabase") {
    const bookingRow = {
      booking_reference: data.bookingReference,
      service_type: data.serviceType,
      vehicle_type: data.vehicleType,
      distance_km: data.distanceKm || null,
      duration_hours: data.durationHours || null,
      pickup_address: data.pickupAddress,
      dropoff_address: data.dropoffAddress,
      pickup_date: data.pickupDate,
      pickup_time: data.pickupTime,
      return_trip: Boolean(data.returnTrip),
      return_date: data.returnDate || null,
      return_time: data.returnTime || null,
      flight_number: data.flightNumber || null,
      passengers: data.passengers || 1,
      luggage: data.luggage || 0,
      special_requests: data.specialRequests || null,
      customer_name: data.customerName,
      email: data.email,
      phone: data.phone,
      estimated_price: data.estimatedPrice || null,
      booking_status: data.bookingStatus || "pending",
      payment_status: data.paymentStatus || "unpaid",
    };

    const { data: createdBooking, error } = await supabase
      .from("bookings")
      .insert(bookingRow)
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase booking insert failed: ${error.message}`);
    }

    return {
      ...createdBooking,
      id: createdBooking.id,
      bookingReference: createdBooking.booking_reference,
      serviceType: createdBooking.service_type,
      vehicleType: createdBooking.vehicle_type,
      distanceKm: createdBooking.distance_km,
      durationHours: createdBooking.duration_hours,
      pickupAddress: createdBooking.pickup_address,
      dropoffAddress: createdBooking.dropoff_address,
      pickupDate: createdBooking.pickup_date,
      pickupTime: createdBooking.pickup_time,
      returnTrip: createdBooking.return_trip,
      returnDate: createdBooking.return_date,
      returnTime: createdBooking.return_time,
      flightNumber: createdBooking.flight_number,
      specialRequests: createdBooking.special_requests,
      customerName: createdBooking.customer_name,
      estimatedPrice: createdBooking.estimated_price,
      bookingStatus: createdBooking.booking_status,
      paymentStatus: createdBooking.payment_status,
      createdAt: createdBooking.created_at,
      updatedAt: createdBooking.updated_at,
    };
  }

  if (getDatabaseDriver() === "mongodb") {
    const booking = await Booking.create(data);
    return normalizeMongoDocument(booking);
  }

  const database = getJsonDatabase();
  const now = new Date().toISOString();

  const booking = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  database.bookings.push(booking);
  await persistJsonDatabase();

  return booking;
};

export const listBookingRecords = async ({
  status = "",
  paymentStatus = "",
  search = "",
} = {}) => {
  if (getDatabaseDriver() === "mongodb") {
    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { reference: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();
    return bookings.map(normalizeMongoDocument);
  }

  const normalizedSearch = search.trim().toLowerCase();

  return getJsonDatabase()
    .bookings.filter((booking) => {
      if (status && booking.status !== status) return false;
      if (paymentStatus && booking.paymentStatus !== paymentStatus) return false;
      if (!normalizedSearch) return true;

      return [
        booking.reference,
        booking.customerName,
        booking.email,
        booking.phone,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(normalizedSearch),
      );
    })
    .sort(sortNewestFirst);
};

export const findBookingRecordById = async (id) => {
  if (getDatabaseDriver() === "mongodb") {
    const booking = await Booking.findById(id).lean();
    return normalizeMongoDocument(booking);
  }

  return getJsonDatabase().bookings.find((booking) => booking.id === id) || null;
};

export const findBookingByReferenceAndEmail = async (reference, email) => {
  const normalizedReference = reference.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();

  if (getDatabaseDriver() === "mongodb") {
    const booking = await Booking.findOne({
      reference: normalizedReference,
      email: normalizedEmail,
    }).lean();
    return normalizeMongoDocument(booking);
  }

  return (
    getJsonDatabase().bookings.find(
      (booking) =>
        booking.reference.toUpperCase() === normalizedReference &&
        booking.email.toLowerCase() === normalizedEmail,
    ) || null
  );
};

export const updateBookingRecord = async (id, updates) => {
  if (getDatabaseDriver() === "mongodb") {
    const booking = await Booking.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();
    return normalizeMongoDocument(booking);
  }

  const database = getJsonDatabase();
  const index = database.bookings.findIndex((booking) => booking.id === id);
  if (index < 0) return null;

  database.bookings[index] = {
    ...database.bookings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await persistJsonDatabase();
  return database.bookings[index];
};

export const deleteBookingRecord = async (id) => {
  if (getDatabaseDriver() === "mongodb") {
    const booking = await Booking.findByIdAndDelete(id).lean();
    return normalizeMongoDocument(booking);
  }

  const database = getJsonDatabase();
  const index = database.bookings.findIndex((booking) => booking.id === id);
  if (index < 0) return null;

  const [deleted] = database.bookings.splice(index, 1);
  await persistJsonDatabase();
  return deleted;
};
