import express from "express";
import {
  sendMessage,
  getAllMessages,
  deleteMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", sendMessage);

// Protected routes (Admin only)
router.get("/", protect, getAllMessages);
router.delete("/:id", protect, deleteMessage);

export default router;
