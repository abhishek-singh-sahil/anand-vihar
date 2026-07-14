import express from "express";
import {
  getBlogs,
  getBlogBySlug,
  likeBlog,
  addCommentToBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

// Public routes
router.get("/", getBlogs);
router.get("/slug/:slug", getBlogBySlug);

// Registered User routes
router.put("/:id/like", protect, likeBlog);
router.post("/:id/comment", protect, sanitizeInput, addCommentToBlog);

// Blog composer routes (author or admin access checked in controller)
router.post("/", protect, upload.single("image"), sanitizeInput, createBlog);
router.put("/:id", protect, upload.single("image"), sanitizeInput, updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
