import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  getMenuItemById,
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
router.get("/items/:id", getMenuItemById);

// Admin-only category routes
router.post("/categories", protect, adminOnly, upload.single("image"), sanitizeInput, createCategory);
router.put("/categories/:id", protect, adminOnly, upload.single("image"), sanitizeInput, updateCategory);
router.delete("/categories/:id", protect, adminOnly, deleteCategory);

// Admin-only product routes
router.post(
  "/items",
  protect,
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 }
  ]),
  sanitizeInput,
  createMenuItem
);
router.put(
  "/items/:id",
  protect,
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 }
  ]),
  sanitizeInput,
  updateMenuItem
);
router.delete("/items/:id", protect, adminOnly, deleteMenuItem);
router.post("/items/bulk-delete", protect, adminOnly, bulkDeleteMenuItems);

export default router;
