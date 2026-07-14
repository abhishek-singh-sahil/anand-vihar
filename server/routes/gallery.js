import express from "express";
import {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
  bulkDeleteGalleryItems,
} from "../controllers/gallery.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Public route
router.get("/", getGalleryItems);

// Admin-only routes
router.post("/", protect, adminOnly, upload.single("media"), sanitizeInput, createGalleryItem);
router.delete("/:id", protect, adminOnly, deleteGalleryItem);
router.post("/bulk-delete", protect, adminOnly, bulkDeleteGalleryItems);

export default router;
