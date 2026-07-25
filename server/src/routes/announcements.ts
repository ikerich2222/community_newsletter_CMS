import express from "express";
import Announcement from "../models/Announcement";
import { verifyToken, verifyAdmin } from "../middleware/auth";

const router = express.Router();

// Get all published announcements (public)
router.get("/published", async (req, res) => {
  try {
    const announcements = await Announcement.find({ status: "published" })
      .populate("author", "name email")
      .sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      announcements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// Get all announcements (admin only)
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      announcements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// Get single announcement
router.get("/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate(
      "author",
      "name email",
    );

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    res.status(200).json({
      success: true,
      announcement,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// Create announcement (admin only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { title, content, status = "draft" } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Title and content required" });
    }

    if (status !== "draft" && status !== "published") {
      return res
        .status(400)
        .json({ success: false, message: "Status must be draft or published" });
    }

    const announcement = new Announcement({
      title,
      content,
      author: req.userId,
      status,
    });

    if (status === "published") {
      announcement.publishedAt = new Date();
    }

    await announcement.save();
    await announcement.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Announcement created",
      announcement,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// Update announcement (admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { title, content, status } = req.body;

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (status) {
      announcement.status = status;
      if (status === "published") {
        announcement.publishedAt = new Date();
      }
    }

    await announcement.save();
    await announcement.populate("author", "name email");

    res.status(200).json({
      success: true,
      message: "Announcement updated",
      announcement,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// Delete announcement (admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    res.status(200).json({
      success: true,
      message: "Announcement deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

export default router;
