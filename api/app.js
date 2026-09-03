'use strict';

/**
 * @file app.js
 * @description Point d'entrée de l'API AK Agency.
 * Architecture MVC — Express + MySQL2
 */

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

const { testConnection } = require('./config/db');
const authRoutes     = require('./routes/auth');
const projectRoutes  = require('./routes/projects');

const app  = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

/* ══════════════════════════════════════════
   Sécurité & middlewares globaux
═══════════════════════════════════════════ */

// En-têtes de sécurité HTTP (XSS, clickjacking, MIME sniffing…)
app.use(helmet());

// CORS — autorise uniquement le frontend configuré
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Limite la taille du body pour éviter les attaques par saturation
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiter global (100 req / 15 min par IP)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes. Réessayez plus tard.' },
}));

/* ══════════════════════════════════════════
   Routes
═══════════════════════════════════════════ */

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth',     authRoutes);
app.use('/api/projects', projectRoutes);

/* ══════════════════════════════════════════
   Gestion des erreurs
═══════════════════════════════════════════ */

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route introuvable : ${req.method} ${req.path}` });
});

// Erreur globale
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('❌', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Erreur interne du serveur.'
      : err.message,
  });
});

/* ══════════════════════════════════════════
   Démarrage
═══════════════════════════════════════════ */

(async () => {
  try {
    await testConnection();
    const server = app.listen(PORT, () => {
      console.log(`🚀 API AK Agency  →  http://localhost:${PORT}`);
      console.log(`   ENV: ${process.env.NODE_ENV || 'development'}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Le port ${PORT} est déjà utilisé. Arrêtez le processus existant ou changez PORT dans .env`);
      } else {
        console.error('❌ Erreur serveur :', err.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('❌ Impossible de démarrer l\'API :', err.message);
    process.exit(1);
  }
})();
