'use strict';

/**
 * @module config/db
 * @description Pool de connexions MySQL2 avec promesses.
 * Utilise les variables d'environnement définies dans .env
 */

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:              process.env.DB_HOST     || 'localhost',
  port:              parseInt(process.env.DB_PORT || '3306', 10),
  user:              process.env.DB_USER     || 'root',
  password:          process.env.DB_PASSWORD || '',
  database:          process.env.DB_NAME     || 'ak_agency',
  charset:           'utf8mb4',
  waitForConnections: true,
  connectionLimit:   10,
  queueLimit:        0,
  timezone:          '+00:00',
});

/**
 * Teste la connexion au démarrage et lève une erreur si la DB est inaccessible.
 */
async function testConnection() {
  const conn = await pool.getConnection();
  console.log('✅ Connexion MySQL établie sur', process.env.DB_NAME);
  conn.release();
}

module.exports = { pool, testConnection };
