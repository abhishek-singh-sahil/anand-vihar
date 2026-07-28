import express from "express";
import { getOffers, createOffer, updateOffer, deleteOffer } from "../controllers/offer.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Public route to view active offers
router.get("/", getOffers);

// Admin operations
router.post("/", protect, adminOnly, sanitizeInput, createOffer);
router.put("/:id", protect, adminOnly, sanitizeInput, updateOffer);
router.delete("/:id", protect, adminOnly, deleteOffer);

export default router;
