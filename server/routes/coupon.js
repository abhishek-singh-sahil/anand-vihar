import express from "express";
import { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon } from "../controllers/coupon.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

router.post("/validate", sanitizeInput, validateCoupon);

// Admin-only routes
router.get("/", protect, adminOnly, getCoupons);
router.post("/", protect, adminOnly, sanitizeInput, createCoupon);
router.put("/:id", protect, adminOnly, sanitizeInput, updateCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);

export default router;

