import express from "express";
import {
  submitContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  subscribeNewsletter,
  getSubscribers,
  deleteSubscriber,
} from "../controllers/contact.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Public routes
router.post("/message", sanitizeInput, submitContactMessage);
router.post("/subscribe", sanitizeInput, subscribeNewsletter);

// Admin-only routes
router.get("/messages", protect, adminOnly, getContactMessages);
router.put("/messages/:id", protect, adminOnly, sanitizeInput, updateContactMessageStatus);
router.delete("/messages/:id", protect, adminOnly, deleteContactMessage);

router.get("/subscribers", protect, adminOnly, getSubscribers);
router.delete("/subscribers/:id", protect, adminOnly, deleteSubscriber);

export default router;
