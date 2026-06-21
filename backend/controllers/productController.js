const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, color, stock, image, rating, images } = req.body;
    const product = await createProduct(name, description, price, category, color, stock, image, rating, images);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating product" });
  }
};

const editProduct = async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating product" });
  }
};

const removeProduct = async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

module.exports = { getProducts, getProduct, addProduct, editProduct, removeProduct };