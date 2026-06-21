const express = require("express");
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser, getAllReviews, deleteReview } = require("../controllers/userAdminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, getAllUsers);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);
router.get("/reviews", protect, adminOnly, getAllReviews);
router.delete("/reviews/:id", protect, adminOnly, deleteReview);

module.exports = router;