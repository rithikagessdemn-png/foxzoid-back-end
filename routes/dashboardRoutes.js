import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

// GET /api/admin/dashboard
router.get("/", getDashboardStats);

export default router;
