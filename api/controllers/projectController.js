'use strict';

/**
 * @controller projectController
 * @description CRUD complet sur les projets (ProjectCard).
 * Lecture publique — écriture réservée aux admins (via middleware auth).
 */

const Project = require('../models/Project');

/* ── Lecture publique ───────────────────────────────────── */

/**
 * GET /api/projects
 * Query params : ?category=Site+Vitrine&visible=true
 * Accès public — ne renvoie que les projets visibles par défaut.
 */
async function getAll(req, res, next) {
  try {
    const { category, visible } = req.query;

    // Par défaut, le front ne voit que les projets visibles
    const isAdmin   = req.user?.role === 'admin';
    const isVisible = isAdmin && visible === 'all' ? undefined : true;

    const projects = await Project.findAll({
      category: category || undefined,
      is_visible: isVisible,
    });

    res.json({ projects, total: projects.length });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/projects/:id
 * Accès public.
 */
async function getOne(req, res, next) {
  try {
    const project = await Project.findById(parseInt(req.params.id, 10));
    if (!project) return res.status(404).json({ error: 'Projet introuvable.' });
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

/* ── Écriture admin ─────────────────────────────────────── */

/**
 * POST /api/projects
 * Body : { title, category, tags, gradient, href, is_visible, sort_order }
 * Accès admin.
 */
async function create(req, res, next) {
  try {
    const { title, category, tags, gradient, href, is_visible, sort_order } = req.body;

    const id      = await Project.create({ title, category, tags, gradient, href, is_visible, sort_order });
    const project = await Project.findById(id);

    res.status(201).json({ message: 'Projet créé.', project });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/projects/:id
 * Body : champs à mettre à jour (partiel supporté)
 * Accès admin.
 */
async function update(req, res, next) {
  try {
    const id      = parseInt(req.params.id, 10);
    const existing = await Project.findById(id);

    if (!existing) return res.status(404).json({ error: 'Projet introuvable.' });

    const updated = await Project.update(id, req.body);
    if (!updated) return res.status(400).json({ error: 'Aucune modification apportée.' });

    const project = await Project.findById(id);
    res.json({ message: 'Projet mis à jour.', project });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/projects/:id
 * Accès admin.
 */
async function remove(req, res, next) {
  try {
    const id      = parseInt(req.params.id, 10);
    const deleted = await Project.delete(id);

    if (!deleted) return res.status(404).json({ error: 'Projet introuvable.' });
    res.json({ message: 'Projet supprimé.' });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/projects/:id/visibility
 * Body : { is_visible: true|false }
 * Accès admin — toggle rapide de visibilité.
 */
async function toggleVisibility(req, res, next) {
  try {
    const id       = parseInt(req.params.id, 10);
    const existing = await Project.findById(id);

    if (!existing) return res.status(404).json({ error: 'Projet introuvable.' });

    const newVal = req.body.is_visible !== undefined ? req.body.is_visible : !existing.is_visible;
    await Project.update(id, { is_visible: newVal ? 1 : 0 });

    const project = await Project.findById(id);
    res.json({ message: `Projet ${newVal ? 'rendu visible' : 'masqué'}.`, project });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove, toggleVisibility };
