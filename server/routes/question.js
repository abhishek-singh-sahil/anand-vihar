import express from "express";
import {
  askQuestion,
  answerQuestion,
  getProductQuestions,
  getAllQuestionsForAdmin,
  deleteQuestion
} from "../controllers/question.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Public: Get public questions for a single product
router.get("/product/:productId", getProductQuestions);

// Protected: Ask a question (User)
router.post("/", protect, sanitizeInput, askQuestion);

// Admin-only operations
router.get("/admin", protect, adminOnly, getAllQuestionsForAdmin);
router.put("/:id/answer", protect, adminOnly, sanitizeInput, answerQuestion);
router.delete("/:id", protect, adminOnly, deleteQuestion);

export default router;
