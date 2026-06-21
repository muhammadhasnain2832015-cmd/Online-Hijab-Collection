const pool = require("../config/db");

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["admin", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
      [role, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error updating user role" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name as user_name, p.name as product_name, p.image as product_image
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN products p ON r.product_id = p.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

const deleteReview = async (req, res) => {
  try {
    await pool.query("DELETE FROM reviews WHERE id = $1", [req.params.id]);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting review" });
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser, getAllReviews, deleteReview };