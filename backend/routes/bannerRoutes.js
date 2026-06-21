const express = require("express");
const router = express.Router();
const {
  getBanners, getActiveBanner,
  createBanner, toggleBanner, deleteBanner
} = require("../controllers/bannerController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, getBanners);
router.get("/active", getActiveBanner);
router.post("/", protect, adminOnly, createBanner);
router.put("/:id/toggle", protect, adminOnly, toggleBanner);
router.delete("/:id", protect, adminOnly, deleteBanner);

module.exports = router;