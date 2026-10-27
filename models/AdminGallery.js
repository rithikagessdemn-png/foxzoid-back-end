import mongoose from "mongoose";

const adminGallerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },        // Person name
    role: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: String, required: true },
    featured: { type: Boolean, default: false },
    image: { type: String, required: true },
  },
  { timestamps: true } // createdAt & updatedAt
);

export default mongoose.model("AdminGallery", adminGallerySchema);
