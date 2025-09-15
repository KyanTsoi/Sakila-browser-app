require('dotenv').config(); // Laad variabelen uit .env bestand

const mysql = require('mysql2');
const logger = require('../util/logger');
const { json } = require('express');
// Maak een connection pool aan. Een pool is efficiënter dan een losse connectie
// omdat het verbindingen hergebruikt.

logger.debug("Database connectie info:")
logger.debug({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Exporteer de pool zodat andere bestanden (zoals je DAO's) ermee kunnen werken
module.exports = pool;