import User from "../models/User.js";
import Game from "../models/AdminGame.js";
import Blog from "../models/AdminBlog.js";
import Gallery from "../models/AdminGallery.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [users, games, blogs, gallery] = await Promise.all([
      User.countDocuments(),
      Game.countDocuments(),
      Blog.countDocuments(),
      Gallery.countDocuments(),
    ]);

    res.status(200).json({
      stats: {
        users,
        games,
        blogs,
        gallery,
      },
      recentActivity: [], // can be extended later
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
