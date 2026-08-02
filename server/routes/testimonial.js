import express from "express";
import {
  getApprovedReviews,
  getReviewsSettings,
  adminGetReviews,
  adminGetSettings,
  adminUpdateSettings,
  adminUpdateReview,
  adminSyncNow,
  adminGetGoogleOAuthUrl,
  googleOAuthCallback,
  adminDisconnectGoogle
} from "../controllers/testimonial.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Public / Visitor routes (no authentication required)
router.get("/approved", getApprovedReviews);
router.get("/settings", getReviewsSettings);
router.get("/google/oauth/callback", googleOAuthCallback); // OAuth Redirect URI callback

// Admin dashboard routes (admin access only)
router.get("/admin", protect, adminOnly, adminGetReviews);
router.get("/admin/settings", protect, adminOnly, adminGetSettings);
router.put("/admin/settings", protect, adminOnly, sanitizeInput, adminUpdateSettings);
router.put("/admin/reviews/:id", protect, adminOnly, sanitizeInput, adminUpdateReview);
router.post("/admin/sync", protect, adminOnly, adminSyncNow);
router.get("/admin/google/oauth/url", protect, adminOnly, adminGetGoogleOAuthUrl);
router.post("/admin/google/oauth/disconnect", protect, adminOnly, adminDisconnectGoogle);

export default router;
