const pool = require("../config/db");

const getCoupons = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM coupons ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coupons" });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { code, discount_percent, max_uses, expires_at } = req.body;
    const existing = await pool.query("SELECT id FROM coupons WHERE code = $1", [code]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    const result = await pool.query(
      "INSERT INTO coupons (code, discount_percent, max_uses, expires_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [code.toUpperCase(), discount_percent, max_uses, expires_at || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error creating coupon" });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { is_active } = req.body;
    const result = await pool.query(
      "UPDATE coupons SET is_active = $1 WHERE id = $2 RETURNING *",
      [is_active, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error updating coupon" });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await pool.query("DELETE FROM coupons WHERE id = $1", [req.params.id]);
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting coupon" });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const result = await pool.query(
      "SELECT * FROM coupons WHERE code = $1 AND is_active = true",
      [code.toUpperCase()]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Invalid or expired coupon" });
    }
    const coupon = result.rows[0];
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }
    if (coupon.uses >= coupon.max_uses) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }
    res.json({ discount_percent: coupon.discount_percent, code: coupon.code });
  } catch (err) {
    res.status(500).json({ message: "Error validating coupon" });
  }
};

module.exports = { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon };