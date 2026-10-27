import unzipper from "unzipper";
import fs from "fs";
import path from "path";

const uploadGame = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const gameId = Date.now();
    const extractPath = `public/games/${gameId}`;

    fs.mkdirSync(extractPath, { recursive: true });

    fs.createReadStream(req.file.path)
      .pipe(unzipper.Extract({ path: extractPath }))
      .on("close", () => {
        res.json({
          success: true,
          gameUrl: `/games/${gameId}/index.html`,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

export default uploadGame;


