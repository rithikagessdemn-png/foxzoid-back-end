import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import AdminGame from "../models/AdminGame.js";

/* =========================
   DETECT WRAPPER FOLDER
   If all ZIP contents are inside one folder (e.g. "Game-master/")
   returns that folder name, else returns null
========================= */
const detectWrapperFolder = async (zipPath) => {
  const topLevelDirs = new Set();
  const topLevelFiles = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .on("entry", (entry) => {
        const parts = entry.path.replace(/\\/g, "/").split("/");
        if (parts.length === 1 && entry.type === "File") {
          topLevelFiles.push(parts[0]);
        } else if (parts.length >= 2) {
          topLevelDirs.add(parts[0]);
        }
        entry.autodrain();
      })
      .on("close", resolve)
      .on("error", reject);
  });

  if (topLevelFiles.length === 0 && topLevelDirs.size === 1) {
    return [...topLevelDirs][0];
  }
  return null;
};

/* =========================
   EXTRACT ZIP — STRIP WRAPPER FOLDER IF PRESENT
========================= */
const extractZip = (zipPath, extractPath, wrapperFolder) => {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(extractPath, { recursive: true });

    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .on("entry", (entry) => {
        let entryPath = entry.path.replace(/\\/g, "/");

        if (wrapperFolder && entryPath.startsWith(`${wrapperFolder}/`)) {
          entryPath = entryPath.slice(wrapperFolder.length + 1);
        }

        if (!entryPath) {
          entry.autodrain();
          return;
        }

        const destPath = path.join(extractPath, entryPath);

        if (entry.type === "Directory") {
          fs.mkdirSync(destPath, { recursive: true });
          entry.autodrain();
        } else {
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          entry.pipe(fs.createWriteStream(destPath));
        }
      })
      .on("close", resolve)
      .on("error", reject);
  });
};

/* =========================
   FIND index.html — root level first
========================= */
const findIndexHtml = (dir, depth = 0) => {
  if (depth > 5) return null;

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }

  const indexFile = entries.find(
    (e) => e.isFile() && e.name.toLowerCase() === "index.html"
  );
  if (indexFile) return path.join(dir, indexFile.name);

  for (const entry of entries.filter((e) => e.isDirectory())) {
    const found = findIndexHtml(path.join(dir, entry.name), depth + 1);
    if (found) return found;
  }

  return null;
};

/* =========================
   CONVERT FILE PATH → GAME URL
   "public/games/123/index.html" → "/games/123/index.html"
========================= */
const toGameUrl = (filePath) => {
  const normalized = filePath.replace(/\\/g, "/");
  const match = normalized.match(/public(\/games\/.+)/);
  return match ? match[1] : null;
};

/* =========================
   BACKGROUND: EXTRACT ZIP + UPDATE DB
========================= */
const extractZipAndUpdateGame = async (zipPath, extractPath, dbGameId) => {
  try {
    console.log(`📦 Extracting ZIP for game ${dbGameId}`);

    const wrapper = await detectWrapperFolder(zipPath);
    console.log(
      wrapper
        ? `📁 Wrapper folder "${wrapper}" detected — stripping`
        : `📁 No wrapper folder`
    );

    await extractZip(zipPath, extractPath, wrapper);
    console.log(`✅ Extracted to: ${extractPath}`);

    try { fs.unlinkSync(zipPath); } catch (_) {}

    const foundPath = findIndexHtml(extractPath);
    if (!foundPath) {
      console.error(`❌ No index.html found for game ${dbGameId}`);
      return;
    }

    const realGameUrl = toGameUrl(foundPath);
    console.log(`🎮 Real gameUrl: ${realGameUrl}`);
    if (!realGameUrl) return;

    await AdminGame.findByIdAndUpdate(dbGameId, { gameUrl: realGameUrl });
    console.log(`✅ DB updated with gameUrl: ${realGameUrl}`);
  } catch (err) {
    console.error(`❌ Background extraction error for game ${dbGameId}:`, err.message);
    try { fs.unlinkSync(zipPath); } catch (_) {}
  }
};

/* =========================
   HELPER: Build safe update object from req.body + files
   Ensures "url" (sent by frontend) is always stored as "gameUrl" in DB
========================= */
const buildGameData = (body, files) => {
  const {
    name, icon, description, category,
    playOption, url,
    featured, status,
  } = body;

  const data = {};

  if (name      !== undefined) data.name        = name;
  if (icon      !== undefined) data.icon        = icon;
  if (description !== undefined) data.description = description;
  if (category  !== undefined) data.category    = category;
  if (playOption !== undefined) data.playOption  = playOption;
  if (featured  !== undefined) data.featured    = featured === "true" || featured === true;
  if (status    !== undefined) data.status      = status;

  // Frontend sends the external URL as the field "url" — always map it to gameUrl
  if (url !== undefined) data.gameUrl = url;

  // ✅ Image upload — Cloudinary returns secure URL in file.path
  if (files?.image?.[0]) {
    // multer-storage-cloudinary stores the Cloudinary URL in file.path
    data.image = files.image[0].path;
  }

  return data;
};

/* =========================
   CREATE GAME
========================= */
export const createGame = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Form data missing. Send as multipart/form-data." });
    }

    const { name, category, playOption, url } = req.body;

    if (!name || !category || !playOption) {
      return res.status(400).json({ message: "name, category and playOption are required" });
    }

    const data = buildGameData(req.body, req.files);

    let zipFilePath = null;

    if (playOption === "internal") {
      const zipFile = req.files?.zip?.[0];
      if (!zipFile) {
        return res.status(400).json({ message: "ZIP file is required for internal games." });
      }

      const gameId = Date.now();
      data.uploadPath  = `public/games/${gameId}`;
      data.zipFileName = zipFile.originalname;
      data.gameUrl     = `/games/${gameId}/index.html`; // placeholder — updated after extraction
      zipFilePath      = zipFile.path;
    }

    // Save to DB immediately (fast response to client)
    const game = await AdminGame.create(data);
    console.log("✅ Game created:", game._id);

    // Extract ZIP in the background (only for internal games)
    if (playOption === "internal" && zipFilePath) {
      extractZipAndUpdateGame(zipFilePath, data.uploadPath, game._id);
    }

    res.status(201).json(game);
  } catch (err) {
    console.error("Create game error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ALL GAMES
========================= */
export const getGames = async (req, res) => {
  try {
    const games = await AdminGame.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch games" });
  }
};

/* =========================
   GET GAME BY ID
========================= */
export const getGameById = async (req, res) => {
  try {
    const game = await AdminGame.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    // Increment view count
    game.views = (game.views || 0) + 1;
    await game.save();

    res.json(game);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch game" });
  }
};

/* =========================
   UPDATE GAME
========================= */
export const updateGame = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Form data missing." });
    }

    const updateData = buildGameData(req.body, req.files);

    let zipFilePath  = null;
    let newUploadPath = null;

    // New ZIP uploaded for an internal game — re-extract
    if (req.files?.zip?.[0] && req.body.playOption === "internal") {
      const zipFile    = req.files.zip[0];
      const newGameId  = Date.now();
      newUploadPath    = `public/games/${newGameId}`;
      zipFilePath      = zipFile.path;

      updateData.gameUrl     = `/games/${newGameId}/index.html`; // placeholder
      updateData.uploadPath  = newUploadPath;
      updateData.zipFileName = zipFile.originalname;
    }

    // If switching to external, clear internal fields
    if (req.body.playOption === "external") {
      updateData.zipFileName = "";
      updateData.uploadPath  = "";
    }

    const game = await AdminGame.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!game) return res.status(404).json({ message: "Game not found" });

    if (zipFilePath && newUploadPath) {
      extractZipAndUpdateGame(zipFilePath, newUploadPath, game._id);
    }

    console.log("✅ Game updated:", game._id);
    res.json(game);
  } catch (err) {
    console.error("Update game error:", err);
    res.status(500).json({ message: err.message || "Update failed" });
  }
};

/* =========================
   DELETE GAME
========================= */
export const deleteGame = async (req, res) => {
  try {
    const game = await AdminGame.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    // Remove extracted game files from disk
    if (game.uploadPath && fs.existsSync(game.uploadPath)) {
      fs.rmSync(game.uploadPath, { recursive: true, force: true });
    }

    await game.deleteOne();
    res.json({ success: true, message: "Game deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* =========================
   TOGGLE FEATURED
========================= */
export const toggleFeatured = async (req, res) => {
  try {
    const game = await AdminGame.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    game.featured = !game.featured;
    await game.save();
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: "Toggle featured failed" });
  }
};

/* =========================
   TOGGLE STATUS (active / inactive)
========================= */
export const toggleStatus = async (req, res) => {
  try {
    const game = await AdminGame.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    game.status = game.status === "active" ? "inactive" : "active";
    await game.save();
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: "Toggle status failed" });
  }
};