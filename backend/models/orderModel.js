const pool = require("../config/db");

const createOrder = async (userId, totalAmount, shippingAddress, items) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const orderResult = await client.query(
      "INSERT INTO orders (user_id, total_amount, shipping_address) VALUES ($1, $2, $3) RETURNING *",
      [userId, totalAmount, shippingAddress]
    );
    const order = orderResult.rows[0];
    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, size, price) VALUES ($1, $2, $3, $4, $5)",
        [order.id, item.id, item.quantity, item.size, item.price]
      );
    }
    await client.query("COMMIT");
    return order;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getUserOrders = async (userId) => {
  const result = await pool.query(
    `SELECT o.*, json_agg(
      json_build_object(
        'product_id', oi.product_id,
        'quantity', oi.quantity,
        'size', oi.size,
        'price', oi.price,
        'name', p.name,
        'image', p.image
      )
    ) as items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = $1
    GROUP BY o.id ORDER BY o.created_at DESC`,
    [userId]
  );
  return result.rows;
};

const fetchAllOrders = async () => {
  const result = await pool.query(
    `SELECT o.*, u.name as customer_name, u.email as customer_email,
    json_agg(
      json_build_object(
        'product_id', oi.product_id,
        'quantity', oi.quantity,
        'size', oi.size,
        'price', oi.price,
        'name', p.name,
        'image', p.image
      )
    ) as items
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    GROUP BY o.id, u.name, u.email
    ORDER BY o.created_at DESC`
  );
  return result.rows;
};

module.exports = { createOrder, getUserOrders, fetchAllOrders };