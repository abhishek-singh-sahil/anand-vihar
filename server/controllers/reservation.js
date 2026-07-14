import Reservation from "../models/Reservation.js";
import { sendReservationConfirmationEmail, sendReservationStatusEmail, sendAdminNotificationEmail } from "../utils/email.js";

export const createReservation = async (req, res, next) => {
  try {
    const { name, phone, email, guests, date, time, specialRequest } = req.body;

    if (!name || !phone || !email || !guests || !date || !time) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const reservation = new Reservation({
      name,
      phone,
      email,
      guests: Number(guests),
      date,
      time,
      specialRequest,
    });

    await reservation.save();

    // Trigger emails
    await sendReservationConfirmationEmail(email, reservation);
    await sendAdminNotificationEmail(
      "New Reservation Request",
      `A new table reservation has been requested by ${name} for ${guests} guests on ${date} at ${time}. Check the dashboard to approve or reject.`
    );

    res.status(201).json({
      success: true,
      message: "Reservation request received. Check email for confirmation details.",
      reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservations = async (req, res, next) => {
  try {
    const { status, date, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const reservations = await Reservation.find(query).sort({ date: 1, time: 1 });
    res.status(200).json({ success: true, reservations });
  } catch (error) {
    next(error);
  }
};

export const updateReservationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved, rejected, pending

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation booking not found" });
    }

    reservation.status = status;
    await reservation.save();

    // Send status update email to user
    await sendReservationStatusEmail(reservation.email, reservation);

    res.status(200).json({ success: true, message: `Reservation marked as ${status} successfully`, reservation });
  } catch (error) {
    next(error);
  }
};

export const deleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation booking not found" });
    }
    res.status(200).json({ success: true, message: "Reservation deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateReservationStatus = async (req, res, next) => {
  try {
    const { ids, status } = req.body;
    if (!ids || !Array.isArray(ids) || !status) {
      return res.status(400).json({ success: false, message: "Invalid batch request parameters" });
    }

    await Reservation.updateMany({ _id: { $in: ids } }, { $set: { status } });
    
    // Fetch and send emails in background
    const reservations = await Reservation.find({ _id: { $in: ids } });
    for (const resv of reservations) {
      await sendReservationStatusEmail(resv.email, resv);
    }

    res.status(200).json({ success: true, message: `Reservations batch updated to ${status} successfully` });
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteReservations = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "Please provide an array of reservation IDs" });
    }

    await Reservation.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, message: "Reservations bulk deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getReservationHistory = async (req, res, next) => {
  try {
    // Get reservations by matching current user's email
    const reservations = await Reservation.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, reservations });
  } catch (error) {
    next(error);
  }
};
