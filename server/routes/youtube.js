import express from "express";
import { getVideos, createVideo, updateVideo, deleteVideo } from "../controllers/youtube.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Public route to view videos
router.get("/", getVideos);

// Admin-only management routes
router.post("/admin", protect, adminOnly, sanitizeInput, createVideo);
router.put("/admin/:id", protect, adminOnly, sanitizeInput, updateVideo);
router.delete("/admin/:id", protect, adminOnly, deleteVideo);

export default router;
