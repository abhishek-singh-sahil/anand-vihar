import express from "express";
import { getSettings, updateSettings } from "../controllers/setting.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET /api/settings - Public
router.get("/", getSettings);

// PUT /api/settings - Admin only
router.put("/", protect, adminOnly, updateSettings);

export default router;
