import express from "express";
import { getBanners, getAdminBanners, createBanner, updateBanner, deleteBanner } from "../controllers/banner.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Public route to get active banners
router.get("/", getBanners);

// Admin-only CRUD routes
router.get("/admin", protect, adminOnly, getAdminBanners);
router.post("/", protect, adminOnly, upload.single("image"), sanitizeInput, createBanner);
router.put("/:id", protect, adminOnly, upload.single("image"), sanitizeInput, updateBanner);
router.delete("/:id", protect, adminOnly, deleteBanner);

export default router;
