import express from "express";
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleFeatured,
} from "../controllers/adminGalleryController.js";

const router = express.Router();

router.get("/", getGallery);
router.post("/", createGalleryItem);
router.put("/:id", updateGalleryItem);
router.delete("/:id", deleteGalleryItem);
router.patch("/:id/featured", toggleFeatured);


export default router;
