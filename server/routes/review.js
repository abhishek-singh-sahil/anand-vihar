import express from "express";
import { 
  getProductReviews, 
  addProductReview, 
  likeProductReview, 
  replyToProductReview, 
  adminGetReviews, 
  adminUpdateReviewStatus, 
  adminDeleteReview 
} from "../controllers/review.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.post("/product/:productId", protect, sanitizeInput, addProductReview);
router.put("/:id/like", protect, likeProductReview);
router.post("/:id/reply", protect, sanitizeInput, replyToProductReview);

// Admin moderation routes
router.get("/", protect, adminOnly, adminGetReviews);
router.put("/:id/status", protect, adminOnly, sanitizeInput, adminUpdateReviewStatus);
router.delete("/:id", protect, adminOnly, adminDeleteReview);

export default router;
