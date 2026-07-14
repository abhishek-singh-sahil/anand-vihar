import express from "express";
import {
  submitTestimonial,
  getApprovedTestimonials,
  likeTestimonial,
  reactToTestimonial,
  addCommentToTestimonial,
  addReplyToComment,
  incrementViewCount,
  adminGetTestimonials,
  adminCreateTestimonial,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
  adminBulkApprove,
  adminBulkDelete,
} from "../controllers/testimonial.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Public / Visitor routes (no authentication required)
router.post("/", upload.array("media", 5), sanitizeInput, submitTestimonial);
router.get("/approved", getApprovedTestimonials);
router.put("/:id/view", incrementViewCount);
router.put("/:id/like", sanitizeInput, likeTestimonial);
router.put("/:id/react", sanitizeInput, reactToTestimonial);
router.post("/:id/comment", sanitizeInput, addCommentToTestimonial);
router.post("/:testimonialId/comment/:commentId/reply", sanitizeInput, addReplyToComment);

// Admin dashboard routes (admin access only)
router.get("/", protect, adminOnly, adminGetTestimonials);
router.post("/admin", protect, adminOnly, upload.array("media", 5), sanitizeInput, adminCreateTestimonial);
router.put("/admin/:id", protect, adminOnly, upload.array("media", 5), sanitizeInput, adminUpdateTestimonial);
router.delete("/admin/:id", protect, adminOnly, adminDeleteTestimonial);
router.post("/bulk-approve", protect, adminOnly, adminBulkApprove);
router.post("/bulk-delete", protect, adminOnly, adminBulkDelete);

export default router;
