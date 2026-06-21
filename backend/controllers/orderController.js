const pool = require("../config/db");
const { createOrder, getUserOrders, fetchAllOrders } = require("../models/orderModel");

const placeOrder = async (req, res) => {
  try {
    const { totalAmount, shippingAddress, items } = req.body;
    const order = await createOrder(req.user.id, totalAmount, shippingAddress, items);
    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error placing order" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await getUserOrders(req.user.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await fetchAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
};
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error updating order status" });
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateStatus };