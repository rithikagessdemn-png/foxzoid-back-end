import AdminGallery from "../models/AdminGallery.js";

// GET all staff
export const getGallery = async (req, res) => {
  try {
    const items = await AdminGallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE staff
export const createGalleryItem = async (req, res) => {
  try {
    const item = await AdminGallery.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE staff
export const updateGalleryItem = async (req, res) => {
  try {
    const updated = await AdminGallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE staff
export const deleteGalleryItem = async (req, res) => {
  try {
    await AdminGallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// TOGGLE featured
export const toggleFeatured = async (req, res) => {
  try {
    const item = await AdminGallery.findById(req.params.id);
    item.featured = !item.featured;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
