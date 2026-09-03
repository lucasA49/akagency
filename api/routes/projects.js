'use strict';

/**
 * @router projects
 * @description Routes CRUD pour les projets.
 *
 * GET    /api/projects            — liste (public, filtres ?category & ?visible=all)
 * GET    /api/projects/:id        — détail (public)
 * POST   /api/projects            — création (admin)
 * PATCH  /api/projects/:id        — mise à jour partielle (admin)
 * DELETE /api/projects/:id        — suppression (admin)
 * PATCH  /api/projects/:id/visibility — toggle visibilité (admin)
 */

const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();

const projectCtrl              = require('../controllers/projectController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const validate                 = require('../middleware/validate');

/* ── Règles de validation ───────────────────────────────── */

const VALID_CATEGORIES = [
  'Site Vitrine',
  'Site E-Commerce',
  'Site Sur Mesure',
  'Identite Visuelle',
];

const VALID_GRADIENTS = [
  'from-violet-600 via-purple-500 to-pink-500',
  'from-slate-700 via-slate-600 to-zinc-500',
  'from-cyan-600 via-blue-500 to-indigo-600',
  'from-amber-600 via-orange-500 to-red-500',
  'from-emerald-600 via-teal-500 to-cyan-500',
  'from-yellow-500 via-orange-400 to-pink-500',
  'from-blue-600 via-indigo-500 to-violet-600',
  'from-rose-500 via-pink-400 to-fuchsia-500',
  'from-violet-600 to-cyan-500',
];

const createRules = [
  body('title')
    .trim().notEmpty().withMessage('Titre requis.')
    .isLength({ max: 255 }).withMessage('Titre max 255 caractères.'),
  body('category')
    .isIn(VALID_CATEGORIES).withMessage(`Catégorie invalide. Valeurs : ${VALID_CATEGORIES.join(', ')}`),
  body('tags')
    .optional()
    .isArray().withMessage('Tags doit être un tableau.')
    .custom((arr) => arr.every((t) => typeof t === 'string'))
    .withMessage('Chaque tag doit être une chaîne de caractères.'),
  body('gradient')
    .optional()
    .isString().withMessage('Gradient doit être une chaîne CSS.'),
  body('href')
    .optional()
    .isLength({ max: 500 }).withMessage('Lien max 500 caractères.')
    .optional({ values: 'falsy' }),
  body('is_visible')
    .optional()
    .isBoolean().withMessage('is_visible doit être true ou false.'),
  body('sort_order')
    .optional()
    .isInt({ min: 0 }).withMessage('sort_order doit être un entier positif.'),
];

const updateRules = [
  body('title').optional().trim().notEmpty().isLength({ max: 255 }),
  body('category').optional().isIn(VALID_CATEGORIES).withMessage('Catégorie invalide.'),
  body('tags').optional().isArray().withMessage('Tags doit être un tableau.'),
  body('gradient').optional().isString(),
  body('href').optional({ values: 'falsy' }).isLength({ max: 500 }).withMessage('Lien max 500 caractères.'),
  body('is_visible').optional().isBoolean(),
  body('sort_order').optional().isInt({ min: 0 }),
];

const visibilityRules = [
  body('is_visible').optional().isBoolean().withMessage('is_visible doit être true ou false.'),
];

/* ── Middleware admin groupé ────────────────────────────── */
const adminGuard = [requireAuth, requireAdmin];

/* ── Routes ─────────────────────────────────────────────── */

// Lecture publique (l'auth est optionnelle pour le paramètre ?visible=all)
router.get ('/',            projectCtrl.getAll);
router.get ('/:id',         projectCtrl.getOne);

// Écriture — admin uniquement
router.post('/',            ...adminGuard, createRules,     validate, projectCtrl.create);
router.patch('/:id',        ...adminGuard, updateRules,     validate, projectCtrl.update);
router.delete('/:id',       ...adminGuard,                            projectCtrl.remove);
router.patch('/:id/visibility', ...adminGuard, visibilityRules, validate, projectCtrl.toggleVisibility);

module.exports = router;
