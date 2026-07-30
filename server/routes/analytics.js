import express from "express";
import {
  getDashboardStats,
  adminGetUsers,
  adminUpdateUserRole,
  adminDeleteUser,
  adminCreateUser,
  adminUpdateUser,
  adminBlockUser,
} from "../controllers/analytics.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Admin-only dashboard analytics and user management
router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/users", protect, adminOnly, adminGetUsers);
router.post("/users", protect, adminOnly, sanitizeInput, adminCreateUser);
router.put("/users/:id", protect, adminOnly, sanitizeInput, adminUpdateUser);
router.put("/users/:id/role", protect, adminOnly, sanitizeInput, adminUpdateUserRole);
router.put("/users/:id/block", protect, adminOnly, sanitizeInput, adminBlockUser);
router.delete("/users/:id", protect, adminOnly, adminDeleteUser);

export default router;
