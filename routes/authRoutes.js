import express from "express";
import { register, login, getAllUsers } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// ✅ Protected route
router.get("/users", protect, getAllUsers);

export default router;
