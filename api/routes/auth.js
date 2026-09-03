'use strict';

/**
 * @router auth
 * @description Routes d'authentification admin.
 *
 * POST /api/auth/login            — connexion
 * GET  /api/auth/me               — profil (auth requise)
 * POST /api/auth/forgot-password  — demande de reset
 * POST /api/auth/reset-password   — changement du mot de passe
 */

const express   = require('express');
const { body }  = require('express-validator');
const router    = express.Router();
const rateLimit = require('express-rate-limit');

const authCtrl           = require('../controllers/authController');
const { requireAuth }    = require('../middleware/auth');
const validate           = require('../middleware/validate');

/* ── Rate limiters spécifiques ──────────────────────────── */

// Limite stricte sur le login : 10 tentatives / 15 min
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite sur forgot-password : 5 demandes / 15 min
const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de demandes de reset. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/* ── Règles de validation ───────────────────────────────── */

const loginRules = [
  body('email').isEmail().withMessage('Email invalide.').normalizeEmail(),
  body('password').notEmpty().withMessage('Mot de passe requis.'),
];

const forgotRules = [
  body('email').isEmail().withMessage('Email invalide.').normalizeEmail(),
];

const resetRules = [
  body('token').notEmpty().withMessage('Token requis.'),
  body('password')
    .isLength({ min: 8 }).withMessage('Mot de passe minimum 8 caractères.')
    .matches(/[A-Z]/).withMessage('Doit contenir au moins une majuscule.')
    .matches(/[0-9]/).withMessage('Doit contenir au moins un chiffre.')
    .matches(/[^A-Za-z0-9]/).withMessage('Doit contenir au moins un caractère spécial.'),
];

/* ── Routes ─────────────────────────────────────────────── */

router.post('/login',           loginLimiter,  loginRules,  validate, authCtrl.login);
router.get ('/me',              requireAuth,                           authCtrl.me);
router.post('/forgot-password', forgotLimiter, forgotRules, validate, authCtrl.forgotPassword);
router.post('/reset-password',                 resetRules,  validate, authCtrl.resetPassword);

module.exports = router;
