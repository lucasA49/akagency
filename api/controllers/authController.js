'use strict';

/**
 * @controller authController
 * @description Gestion de l'authentification admin :
 *   - login
 *   - profil (me)
 *   - mot de passe oublié
 *   - réinitialisation du mot de passe
 */

const crypto  = require('crypto');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const mailer  = require('../utils/mailer');

/* ── Constantes ─────────────────────────────────────────── */

const SALT_ROUNDS   = 12;  // coût bcrypt (augmenter = plus sécurisé mais plus lent)
const RESET_EXPIRES = parseInt(process.env.RESET_TOKEN_EXPIRES_MINUTES || '60', 10);

/* ── Helpers ────────────────────────────────────────────── */

/** Génère un JWT signé pour l'utilisateur donné */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

/** Hash SHA-256 d'un token brut (pour stockage en BDD) */
function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

/* ── Contrôleurs ────────────────────────────────────────── */

/**
 * POST /api/auth/login
 * Body : { email, password }
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email.toLowerCase().trim());

    // Utilise un faux hash pour éviter les timing attacks si l'email n'existe pas
    const fakeHash = '$2a$12$invalidhashtopreventtimingattacksXXXXXXXXXXXXXXXXXXXXXX';
    const hash     = user ? user.password_hash : fakeHash;

    const valid = await bcrypt.compare(password, hash);

    if (!user || !valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Header : Authorization: Bearer <token>
 */
async function me(req, res) {
  res.json({ user: req.user });
}

/**
 * POST /api/auth/forgot-password
 * Body : { email }
 * Envoie un email de reset même si l'email n'existe pas
 * (pour ne pas révéler les comptes existants).
 */
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email.toLowerCase().trim());

    if (user) {
      // Génère un token aléatoire de 32 octets (256 bits)
      const rawToken   = crypto.randomBytes(32).toString('hex');
      const tokenHash  = sha256(rawToken);
      const expires    = new Date(Date.now() + RESET_EXPIRES * 60 * 1000);

      await User.setResetToken(user.id, tokenHash, expires);

      // Envoi de l'email (ne bloque pas la réponse si l'envoi échoue)
      try {
        await mailer.sendPasswordResetEmail(user.email, rawToken);
      } catch (mailErr) {
        console.error('Erreur envoi email reset :', mailErr.message);
      }
    }

    // Réponse identique que l'email existe ou non (sécurité)
    res.json({
      message: `Si un compte existe pour ${email}, un e-mail de réinitialisation a été envoyé.`,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/reset-password
 * Body : { token, password }
 */
async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const tokenHash = sha256(token);
    const user      = await User.findByResetToken(tokenHash);

    if (!user) {
      return res.status(400).json({ error: 'Token invalide ou expiré.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await User.updatePassword(user.id, passwordHash);

    res.json({ message: 'Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, me, forgotPassword, resetPassword };
