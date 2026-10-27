import express from "express";
import {
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleFeatured,
  toggleStatus,
} from "../controllers/adminBlogController.js"; // ✅ Fixed case: adminBlogController (not adminblogcontroller)

const router = express.Router();

// ===================== PUBLIC ROUTES (FOR FRONTEND) =====================
// Get only published blogs - MUST BE BEFORE /:id route
router.get("/public/published", getPublishedBlogs);

// ===================== ADMIN ROUTES =====================
// Get all blogs (including drafts - for admin panel)
router.get("/", getAllBlogs);

// Get single blog by ID
router.get("/:id", getBlogById);

// Create new blog
router.post("/", createBlog);

// Update blog
router.put("/:id", updateBlog);

// Delete blog
router.delete("/:id", deleteBlog);

// Toggle featured status
router.patch("/:id/featured", toggleFeatured);

// Toggle publish status (draft/published)
router.patch("/:id/status", toggleStatus);

export default router;