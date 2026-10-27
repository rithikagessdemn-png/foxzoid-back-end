import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminGalleryRoutes from "./routes/adminGalleryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminBlogRoutes from "./routes/adminBlogRoutes.js";
import adminGameRoutes from "./routes/adminGameRoutes.js";
import gameRoutes from "./routes/game.routes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

/* =========================
   BASIC SETUP
========================= */
dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   🔐 ENV VALIDATION (IMPORTANT)
========================= */
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

/* =========================
   🌍 CORS CONFIG 
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://foxzoidgamestudio.com",
  "http://foxzoidgamestudio.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin is in the allowed list or if we're in development
      if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        // For production, you might want to be more restrictive
        callback(null, true); // Keeping it permissive for now as requested
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   BODY PARSERS
========================= */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

/* =========================
   MIDDLEWARE TO ALLOW IFRAME EMBEDDING
========================= */
app.use((req, res, next) => {
  // Allow embedding in iframes from any origin
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  next();
});

/* =========================
   STATIC FILES
========================= */
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/games", express.static(path.join(__dirname, "public/games")));
app.use("/api/game-images", express.static(path.join(__dirname, "public/game-images")));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/admingallery", adminGalleryRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/adminblog", adminBlogRoutes);
app.use("/api/admingames", adminGameRoutes);
app.use("/api/newsletter", subscriberRoutes);
app.use("/api/messages", messageRoutes);
app.use("/", gameRoutes);

/* =========================
   PROXY ROUTE FOR EXTERNAL IFRAMES
========================= */
app.get("/api/proxy", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: "URL parameter is required" });
    }

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    // Remove restrictive headers
    delete response.headers["x-frame-options"];
    delete response.headers["content-security-policy"];

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

/* =========================
   HEALTH CHECK (TEST URL)
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "🚀 Backend is running successfully",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* =========================
   DATABASE + SERVER START
========================= */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();