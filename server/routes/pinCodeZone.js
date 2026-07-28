import express from "express";
import {
  getPinCodeZones,
  createPinCodeZone,
  bulkCreatePinCodeZones,
  updatePinCodeZone,
  deletePinCodeZone,
  checkPinCodeAvailability,
  getPublicPinCodes
} from "../controllers/pinCodeZone.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Public check
router.get("/public", getPublicPinCodes);
router.get("/check/:code", checkPinCodeAvailability);

// Admin-only operations
router.get("/", protect, adminOnly, getPinCodeZones);
router.post("/", protect, adminOnly, sanitizeInput, createPinCodeZone);
router.post("/bulk", protect, adminOnly, bulkCreatePinCodeZones);
router.put("/:id", protect, adminOnly, sanitizeInput, updatePinCodeZone);
router.delete("/:id", protect, adminOnly, deletePinCodeZone);

export default router;
