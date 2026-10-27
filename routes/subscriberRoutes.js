import express from "express";
import {
  subscribe,
  getAllSubscribers,
} from "../controllers/subscriberController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", subscribe);

// Protected routes (Admin only)
router.get("/", protect, getAllSubscribers);

export default router;
