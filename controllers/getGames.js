import fs from "fs";
import path from "path";

const GAMES_DIR = path.join(process.cwd(), "public/games");

/**
 * GET ALL GAMES
 */
export const getAllGames = (req, res) => {
  try {
    if (!fs.existsSync(GAMES_DIR)) {
      return res.json({ success: true, games: [] });
    }

    const gameFolders = fs.readdirSync(GAMES_DIR);

    const games = gameFolders.map((id) => ({
      id,
      gameUrl: `/games/${id}/index.html`,
    }));

    res.json({
      success: true,
      games,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch games" });
  }
};

/**
 * GET GAME BY ID
 */
export const getGameById = (req, res) => {
  try {
    const { id } = req.params;
    const gamePath = path.join(GAMES_DIR, id, "index.html");

    if (!fs.existsSync(gamePath)) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    res.json({
      success: true,
      game: {
        id,
        gameUrl: `/games/${id}/index.html`,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch game" });
  }
};

export const deleteGameById = (req, res) => {
  try {
    const { id } = req.params;
    const gameDir = path.join(GAMES_DIR, id);

    if (!fs.existsSync(gameDir)) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    // Remove game folder recursively
    fs.rmSync(gameDir, { recursive: true, force: true });

    res.json({
      success: true,
      message: "Game deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete game",
    });
  }
};