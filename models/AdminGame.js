import mongoose from "mongoose";

const adminGameSchema = new mongoose.Schema(
  {
    /* ── Basic Info ─────────────────────────────────────────── */
    name: {
      type: String,
      required: [true, "Game name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    icon: { type: String, default: "🎮" },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Adventure", "Strategy", "Action", "Puzzle", "RPG", "Sports", "Other"],
      default: "Other",
    },

    /* ── Media ──────────────────────────────────────────────── */
    image: { type: String, default: "" }, // thumbnail path / URL

    /* ── Play config ────────────────────────────────────────── */
    playOption: {
      type: String,
      enum: ["internal", "external"],
      required: [true, "playOption is required"],
      default: "external",
    },

    // External game URL (iframe / direct link)
    gameUrl: { type: String, default: "" },

    // Internal (Unity WebGL) ZIP fields
    zipFileName: { type: String, default: "" },
    uploadPath:  { type: String, default: "" }, // e.g. public/games/1234567890

    /* ── Stats ──────────────────────────────────────────────── */
    views: { type: Number, default: 0 },

    /* ── Visibility ─────────────────────────────────────────── */
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

/* Indexes */
adminGameSchema.index({ name: "text", description: "text" });
adminGameSchema.index({ category: 1, status: 1, createdAt: -1 });

export default mongoose.model("admingame", adminGameSchema);
