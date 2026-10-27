import multer from "multer";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Cloudinary storage for images (game thumbnails, etc.)
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "foxzoid-games",           // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif", "gif"],
    transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto" }],
  },
});

// ✅ Disk storage for ZIP files (large, can't go to Cloudinary)
const zipDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".zip");
  },
});

// ✅ Route each file to the correct storage
const storage = {
  _handleFile(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      // Use Cloudinary for images
      cloudinaryStorage._handleFile(req, file, cb);
    } else {
      // Use disk for ZIP files
      zipDiskStorage._handleFile(req, file, cb);
    }
  },
  _removeFile(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cloudinaryStorage._removeFile(req, file, cb);
    } else {
      zipDiskStorage._removeFile(req, file, cb);
    }
  },
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 500 }, // 500MB
});

export default upload;