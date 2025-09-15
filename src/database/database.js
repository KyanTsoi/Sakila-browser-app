const mysql = require('mysql2');

// Maak een connection pool aan. Een pool is efficiënter dan een losse connectie
// omdat het verbindingen hergebruikt.
const pool = mysql.createPool({
  host: process.env.DB_HOST || DB_HOST,
  user: process.env.DB_USER || DB_USER,
  password: process.env.DB_PASSWORD || DB_PASSWORD,
  database: process.env.DB_DATABASE || DB_DATABASE,
  port: process.env.DB_PORT || DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Exporteer de pool zodat andere bestanden (zoals je DAO's) ermee kunnen werken
module.exports = pool;