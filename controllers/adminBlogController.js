import AdminBlog from "../models/AdminBlog.js";

// ===================== GET ALL BLOGS =====================
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await AdminBlog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== GET PUBLISHED BLOGS (FOR FRONTEND) =====================
export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await AdminBlog.find({ status: "published" }).sort({ publishDate: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== GET SINGLE BLOG =====================
export const getBlogById = async (req, res) => {
  try {
    const blog = await AdminBlog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== CREATE BLOG =====================
export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, image, author, category, tags, featured, status, publishDate, readTime } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    // ✅ Ensure tags is an array
    const processedTags = Array.isArray(tags) ? tags : [];

    const newBlog = new AdminBlog({
      title,
      content,
      excerpt: excerpt || "",
      image: image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop",
      author: author || "Admin",
      category: category || "Technology",
      tags: processedTags,
      featured: featured || false,
      status: status || "draft",
      publishDate: publishDate || Date.now(),
      readTime: readTime || 5,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json({ success: true, data: savedBlog, message: "Blog created successfully" });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== UPDATE BLOG =====================
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // ✅ Ensure tags is an array if provided
    if (updateData.tags && !Array.isArray(updateData.tags)) {
      updateData.tags = [];
    }

    const updatedBlog = await AdminBlog.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, data: updatedBlog, message: "Blog updated successfully" });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== DELETE BLOG =====================
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBlog = await AdminBlog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== TOGGLE FEATURED =====================
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await AdminBlog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    blog.featured = !blog.featured;
    await blog.save();

    res.status(200).json({ success: true, data: blog, message: "Featured status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== TOGGLE STATUS (DRAFT/PUBLISHED) =====================
export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await AdminBlog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    blog.status = blog.status === "draft" ? "published" : "draft";
    await blog.save();

    res.status(200).json({ success: true, data: blog, message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};