import multer from "multer";
import fs from "fs";
import path from "path";

const imageDir = "public/game-images";

if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

// ✅ Images go to disk (they need a permanent path)
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// ✅ ZIP goes to disk too (memory is risky for large files),
//    but we skip the double-read by streaming directly during extraction
const zipStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".zip");
  },
});

// Route each file to the right storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
      cb(null, imageDir);
    } else {
      const uploadDir = "uploads";
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".zip";
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 500 }, // 500MB
});

export default upload;