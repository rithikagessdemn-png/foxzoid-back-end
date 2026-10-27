import express from "express";
import multer from "multer";
import uploadGame from "../controllers/uploadGmae.js";
import { getAllGames, getGameById,deleteGameById } from "../controllers/getGames.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload-game", upload.single("gameZip"), uploadGame);

// GET all games
router.get("/games", getAllGames);

// GET game by ID
router.get("/games/:id", getGameById);

router.delete("/game/:id", deleteGameById);
export default router;
