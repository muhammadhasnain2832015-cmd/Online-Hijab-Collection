const express = require("express");
const router = express.Router();
const { getProducts, getProduct, addProduct, editProduct, removeProduct } = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, adminOnly, addProduct);
router.put("/:id", protect, adminOnly, editProduct);
router.delete("/:id", protect, adminOnly, removeProduct);

module.exports = router;