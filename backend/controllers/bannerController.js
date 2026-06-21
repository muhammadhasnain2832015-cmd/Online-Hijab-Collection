const pool = require("../config/db");

const getBanners = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM banners ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching banners" });
  }
};

const getActiveBanner = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM banners WHERE is_active = true ORDER BY created_at DESC LIMIT 1"
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ message: "Error fetching active banner" });
  }
};

const createBanner = async (req, res) => {
  try {
    const { title, subtitle, image_url } = req.body;
    if (!image_url) {
      return res.status(400).json({ message: "Image is required" });
    }
    const result = await pool.query(
      "INSERT INTO banners (title, subtitle, image_url) VALUES ($1, $2, $3) RETURNING *",
      [title, subtitle, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error creating banner" });
  }
};

const toggleBanner = async (req, res) => {
  try {
    // First get current status
    const current = await pool.query(
      "SELECT is_active FROM banners WHERE id = $1",
      [req.params.id]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const newStatus = !current.rows[0].is_active;

    const result = await pool.query(
      "UPDATE banners SET is_active = $1 WHERE id = $2 RETURNING *",
      [newStatus, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ message: "Error updating banner" });
  }
};

const deleteBanner = async (req, res) => {
  try {
    await pool.query("DELETE FROM banners WHERE id = $1", [req.params.id]);
    res.json({ message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting banner" });
  }
};

module.exports = { getBanners, getActiveBanner, createBanner, toggleBanner, deleteBanner };