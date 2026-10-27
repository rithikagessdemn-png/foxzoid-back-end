import Subscriber from "../models/Subscriber.js";

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "You are already subscribed!" });
    }

    const subscriber = await Subscriber.create({ email });
    res.status(201).json({
      success: true,
      message: "Subscribed successfully!",
      subscriber,
    });
  } catch (error) {
    console.error("Newsletter Subscription Error:", error);
    res.status(500).json({ message: "Subscription failed. Please try again later." });
  }
};

// @desc    Get all subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ success: true, count: subscribers.length, subscribers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
};
