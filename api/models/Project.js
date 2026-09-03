'use strict';

/**
 * @model Project
 * @description Accès aux données de la table `projects`.
 */

const { pool } = require('../config/db');

const Project = {

  /**
   * Retourne tous les projets avec filtres optionnels.
   * @param {Object} filters
   * @param {string}  [filters.category]
   * @param {boolean} [filters.is_visible]  — si undefined : tous
   * @returns {Promise<Array>}
   */
  async findAll({ category, is_visible } = {}) {
    let sql = 'SELECT * FROM projects WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (is_visible !== undefined) {
      sql += ' AND is_visible = ?';
      params.push(is_visible ? 1 : 0);
    }

    sql += ' ORDER BY sort_order ASC, created_at DESC';

    const [rows] = await pool.execute(sql, params);

    // Convertit le champ JSON `tags` si renvoyé en string
    return rows.map(Project._parse);
  },

  /**
   * Trouve un projet par son ID.
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM projects WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] ? Project._parse(rows[0]) : null;
  },

  /**
   * Crée un nouveau projet.
   * @param {Object} data
   * @returns {Promise<number>} ID inséré
   */
  async create({ title, category, tags = [], gradient, href = '#', is_visible = 1, sort_order = 0 }) {
    const [result] = await pool.execute(
      `INSERT INTO projects (title, category, tags, gradient, href, is_visible, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, category, JSON.stringify(tags), gradient, href, is_visible ? 1 : 0, sort_order]
    );
    return result.insertId;
  },

  /**
   * Met à jour un projet existant (mise à jour partielle supportée).
   * @param {number} id
   * @param {Object} data — champs à mettre à jour
   * @returns {Promise<boolean>} true si une ligne a été modifiée
   */
  async update(id, data) {
    const allowed = ['title', 'category', 'tags', 'gradient', 'href', 'is_visible', 'sort_order'];
    const fields  = [];
    const params  = [];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(key === 'tags' ? JSON.stringify(data[key]) : data[key]);
      }
    }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.execute(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    return result.affectedRows > 0;
  },

  /**
   * Supprime un projet.
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM projects WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  /** @private Normalise le champ JSON `tags` */
  _parse(row) {
    return {
      ...row,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
      is_visible: Boolean(row.is_visible),
    };
  },
};

module.exports = Project;
