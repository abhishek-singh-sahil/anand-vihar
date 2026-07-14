import express from "express";
import {
  register,
  verifyOtp,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile,
} from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

router.post("/register", sanitizeInput, register);
router.post("/verify-otp", sanitizeInput, verifyOtp);
router.post("/login", sanitizeInput, login);
router.post("/logout", logout);
router.post("/refresh-token", refresh);
router.post("/forgot-password", sanitizeInput, forgotPassword);
router.post("/reset-password", sanitizeInput, resetPassword);

// Protected routes
router.put("/change-password", protect, sanitizeInput, changePassword);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("profilePic"), sanitizeInput, updateProfile);

export default router;
