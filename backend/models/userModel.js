const pool = require("../config/db");

const createUser = async (name, email, phone, hashedPassword) => {
  const result = await pool.query(
    "INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, role",
    [name, email, phone, hashedPassword]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users WHERE id = $1", [id]
  );
  return result.rows[0];
};

module.exports = { createUser, findUserByEmail, findUserById };