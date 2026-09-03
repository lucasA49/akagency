'use strict';

/**
 * @script seed.js
 * @description Initialise la base de données :
 *   1. Crée le compte administrateur (lucasaksu@gmail.com)
 *   2. Insère les 8 projets de démonstration
 *
 * Usage : node scripts/seed.js
 * ⚠️  Changez le mot de passe après la première connexion !
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const bcrypt       = require('bcryptjs');
const { pool }     = require('../config/db');

/* ── Configuration du compte admin ──────── */

const ADMIN_EMAIL    = 'lucasaksu@gmail.com';
const ADMIN_PASSWORD = 'Admin@2026!';  // À CHANGER après connexion
const SALT_ROUNDS    = 12;

/* ── Projets de démo (depuis Realisations.jsx) ─── */

const DEMO_PROJECTS = [
  { title: 'Maison Leclair',     category: 'Site E-Commerce',    tags: ['React','Stripe','Tailwind','Sanity'],       gradient: 'from-violet-600 via-purple-500 to-pink-500',   sort_order: 1 },
  { title: 'Studio Arkhe',       category: 'Identite Visuelle',  tags: ['Branding','Figma','Print'],                gradient: 'from-slate-700 via-slate-600 to-zinc-500',     sort_order: 2 },
  { title: 'NovaTech SaaS',      category: 'Site Sur Mesure',    tags: ['Next.js','Supabase','TypeScript'],          gradient: 'from-cyan-600 via-blue-500 to-indigo-600',     sort_order: 3 },
  { title: 'Le Bistrot Parisien',category: 'Site Vitrine',       tags: ['React','Tailwind','Contentful'],            gradient: 'from-amber-600 via-orange-500 to-red-500',     sort_order: 4 },
  { title: 'GreenBox',           category: 'Site E-Commerce',    tags: ['Shopify','Liquid','SEO'],                   gradient: 'from-emerald-600 via-teal-500 to-cyan-500',    sort_order: 5 },
  { title: 'Agence Lumiere',     category: 'Identite Visuelle',  tags: ['Branding','Motion','Figma'],               gradient: 'from-yellow-500 via-orange-400 to-pink-500',   sort_order: 6 },
  { title: 'MediConnect',        category: 'Site Sur Mesure',    tags: ['React','Node.js','PostgreSQL'],             gradient: 'from-blue-600 via-indigo-500 to-violet-600',   sort_order: 7 },
  { title: 'Fleur & Co.',        category: 'Site Vitrine',       tags: ['Gatsby','Tailwind','GSAP'],                gradient: 'from-rose-500 via-pink-400 to-fuchsia-500',    sort_order: 8 },
];

async function seed() {
  console.log('\n🌱 Démarrage du seed AK Agency...\n');

  try {
    // ── 1. Compte admin ──────────────────────────────────
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [ADMIN_EMAIL]
    );

    if (existing.length > 0) {
      console.log(`⚠️  Admin "${ADMIN_EMAIL}" existe déjà — ignoré.`);
    } else {
      const hash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
      await pool.execute(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, "admin")',
        [ADMIN_EMAIL, hash]
      );
      console.log(`✅ Admin créé : ${ADMIN_EMAIL}`);
      console.log(`   Mot de passe par défaut : ${ADMIN_PASSWORD}`);
      console.log('   ⚠️  CHANGEZ CE MOT DE PASSE APRÈS LA PREMIÈRE CONNEXION !\n');
    }

    // ── 2. Projets de démo ────────────────────────────────
    const [projCount] = await pool.execute('SELECT COUNT(*) AS n FROM projects');
    if (projCount[0].n > 0) {
      console.log(`⚠️  ${projCount[0].n} projet(s) déjà présents — projets ignorés.`);
    } else {
      for (const p of DEMO_PROJECTS) {
        await pool.execute(
          `INSERT INTO projects (title, category, tags, gradient, href, is_visible, sort_order)
           VALUES (?, ?, ?, ?, '#', 1, ?)`,
          [p.title, p.category, JSON.stringify(p.tags), p.gradient, p.sort_order]
        );
        console.log(`   ➕ ${p.title} (${p.category})`);
      }
      console.log(`\n✅ ${DEMO_PROJECTS.length} projets insérés.`);
    }

    console.log('\n✨ Seed terminé avec succès.\n');
  } catch (err) {
    console.error('❌ Erreur seed :', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
