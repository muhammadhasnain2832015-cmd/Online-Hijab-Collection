const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client — reconnecting...", err.message);
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Neon PostgreSQL connection error:", err.message);
  } else {
    console.log("Neon PostgreSQL connected successfully!");
    release();
  }
});

module.exports = pool;