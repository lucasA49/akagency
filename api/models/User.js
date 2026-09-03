'use strict';

/**
 * @model User
 * @description Accès aux données de la table `users`.
 * Toutes les requêtes SQL passent par ce modèle.
 */

const { pool } = require('../config/db');

const User = {

  /**
   * Trouve un utilisateur par son email.
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Trouve un utilisateur par son ID.
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, email, role, created_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Crée un nouvel administrateur.
   * @param {string} email
   * @param {string} passwordHash — hash bcrypt déjà calculé
   * @returns {Promise<number>} ID inséré
   */
  async create(email, passwordHash) {
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, "admin")',
      [email, passwordHash]
    );
    return result.insertId;
  },

  /**
   * Stocke le hash SHA-256 du token de réinitialisation et sa date d'expiration.
   * @param {number} id
   * @param {string} tokenHash — SHA-256 hex
   * @param {Date}   expires
   */
  async setResetToken(id, tokenHash, expires) {
    await pool.execute(
      'UPDATE users SET reset_token_hash = ?, reset_token_expires = ? WHERE id = ?',
      [tokenHash, expires, id]
    );
  },

  /**
   * Trouve un utilisateur dont le reset_token_hash correspond et n'est pas expiré.
   * @param {string} tokenHash — SHA-256 hex
   * @returns {Promise<Object|null>}
   */
  async findByResetToken(tokenHash) {
    const [rows] = await pool.execute(
      `SELECT * FROM users
       WHERE reset_token_hash = ?
         AND reset_token_expires > NOW()
       LIMIT 1`,
      [tokenHash]
    );
    return rows[0] || null;
  },

  /**
   * Met à jour le mot de passe et efface le token de reset.
   * @param {number} id
   * @param {string} passwordHash — nouveau hash bcrypt
   */
  async updatePassword(id, passwordHash) {
    await pool.execute(
      `UPDATE users
       SET password_hash = ?, reset_token_hash = NULL, reset_token_expires = NULL
       WHERE id = ?`,
      [passwordHash, id]
    );
  },
};

module.exports = User;
