import express from "express";
import upload from "../middleware/gameUpload.js";
import {
  createGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
  toggleFeatured,
  toggleStatus,
} from "../controllers/adminGameController.js";

const router = express.Router();

/* ── READ ─────────────────────────────────────────────── */
router.get("/", getGames);
router.get("/game/:id", getGameById);

/* ── CREATE ──────────────────────────────────────────── */
router.post(
  "/",
  upload.fields([
    { name: "zip",   maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createGame
);

/* ── UPDATE ──────────────────────────────────────────── */
router.put(
  "/:id",
  upload.fields([
    { name: "zip",   maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  updateGame
);

/* ── DELETE ──────────────────────────────────────────── */
router.delete("/:id", deleteGame);

/* ── TOGGLE ──────────────────────────────────────────── */
router.patch("/:id/featured", toggleFeatured);
router.patch("/:id/status",   toggleStatus);

export default router;
