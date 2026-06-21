const pool = require("../config/db");

const getAllProducts = async () => {
  const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0];
};

const createProduct = async (name, description, price, category, color, stock, image, rating, images) => {
  const result = await pool.query(
    "INSERT INTO products (name, description, price, category, color, stock, image, rating, images) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
    [name, description, price, category, color, stock, image, rating, images || []]
  );
  return result.rows[0];
};

const updateProduct = async (id, fields) => {
  const { name, description, price, category, color, stock, image, rating, images } = fields;
  const result = await pool.query(
    `UPDATE products 
     SET name=$1, description=$2, price=$3, category=$4, 
         color=$5, stock=$6, image=$7, rating=$8, images=$9
     WHERE id=$10 RETURNING *`,
    [name, description, price, category, color, stock, image, rating, images || [], id]
  );
  return result.rows[0];
};

const deleteProduct = async (id) => {
  await pool.query("DELETE FROM products WHERE id = $1", [id]);
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };