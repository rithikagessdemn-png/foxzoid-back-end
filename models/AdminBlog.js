import mongoose from "mongoose";

const adminBlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    excerpt: {
      type: String,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
      trim: true,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop",
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      default: "Admin",
    },
    category: {
      type: String,
      enum: ["Technology", "Design", "Development", "Business", "Marketing", "Gaming", "Other"],
      default: "Technology",
    },
    tags: [{
      type: String,
      trim: true,
    }],
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number,
      default: 5, // in minutes
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
adminBlogSchema.index({ title: "text", content: "text", tags: "text" });
adminBlogSchema.index({ category: 1, status: 1, publishDate: -1 });

const AdminBlog = mongoose.model("AdminBlog", adminBlogSchema);

export default AdminBlog;