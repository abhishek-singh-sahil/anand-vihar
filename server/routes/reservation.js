import express from "express";
import {
  createReservation,
  getReservations,
  updateReservationStatus,
  deleteReservation,
  bulkUpdateReservationStatus,
  bulkDeleteReservations,
  getReservationHistory,
} from "../controllers/reservation.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Public route to request reservation
router.post("/", sanitizeInput, createReservation);

// Authenticated user route to view their booking history
router.get("/history", protect, getReservationHistory);

// Admin-only reservation management routes
router.get("/", protect, adminOnly, getReservations);
router.put("/:id/status", protect, adminOnly, sanitizeInput, updateReservationStatus);
router.delete("/:id", protect, adminOnly, deleteReservation);
router.post("/bulk-status", protect, adminOnly, sanitizeInput, bulkUpdateReservationStatus);
router.post("/bulk-delete", protect, adminOnly, bulkDeleteReservations);

export default router;
