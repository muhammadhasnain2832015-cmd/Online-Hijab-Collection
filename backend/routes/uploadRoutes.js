const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { protect, adminOnly } = require("../middleware/authMiddleware");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage instead of Cloudinary storage
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Upload directly to Cloudinary with public access
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "hijab-store",
          resource_type: "image",
          type: "upload",
          access_mode: "public",
          invalidate: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Image upload failed", error: err.message });
  }
});

router.delete("/", protect, adminOnly, async (req, res) => {
  try {
    const { public_id } = req.body;
    await cloudinary.uploader.destroy(public_id);
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete image" });
  }
});

module.exports = router;