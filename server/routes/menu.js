import express from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  bulkDeleteMenuItems,
} from "../controllers/menu.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Public routes
router.get("/categories", getCategories);
router.get("/items", getMenuItems);

// Admin-only routes
router.post("/categories", protect, adminOnly, sanitizeInput, createCategory);
router.delete("/categories/:id", protect, adminOnly, deleteCategory);

router.post("/items", protect, adminOnly, upload.single("image"), sanitizeInput, createMenuItem);
router.put("/items/:id", protect, adminOnly, upload.single("image"), sanitizeInput, updateMenuItem);
router.delete("/items/:id", protect, adminOnly, deleteMenuItem);
router.post("/items/bulk-delete", protect, adminOnly, bulkDeleteMenuItems);

export default router;
