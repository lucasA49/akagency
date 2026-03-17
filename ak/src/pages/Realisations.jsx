/**
 * @page Realisations
 * @route /realisations
 * @description Page portfolio affichant les projets réalisés par l'agence.
 *
 * Sections :
 *  1. Hero page    — Titre + filtres par catégorie
 *  2. Grille       — Projets filtrables avec animation
 *  3. CTA          — Appel à l'action
 */

import { useState } from 'react';
import { Link }     from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import ProjectCard     from '../components/ProjectCard';

/* ──────────────── Données ──────────────── */

const PROJECTS = [
  {
    title: 'Maison Leclair',
    category: 'Site E-Commerce',
    tags: ['React', 'Stripe', 'Tailwind', 'Sanity'],
    gradient: 'from-violet-600 via-purple-500 to-pink-500',
  },
  {
    title: 'Studio Arkhe',
    category: 'Identite Visuelle',
    tags: ['Branding', 'Figma', 'Print'],
    gradient: 'from-slate-700 via-slate-600 to-zinc-500',
  },
  {
    title: 'NovaTech SaaS',
    category: 'Site Sur Mesure',
    tags: ['Next.js', 'Supabase', 'TypeScript'],
    gradient: 'from-cyan-600 via-blue-500 to-indigo-600',
  },
  {
    title: 'Le Bistrot Parisien',
    category: 'Site Vitrine',
    tags: ['React', 'Tailwind', 'Contentful'],
    gradient: 'from-amber-600 via-orange-500 to-red-500',
  },
  {
    title: 'GreenBox',
    category: 'Site E-Commerce',
    tags: ['Shopify', 'Liquid', 'SEO'],
    gradient: 'from-emerald-600 via-teal-500 to-cyan-500',
  },
  {
    title: 'Agence Lumiere',
    category: 'Identite Visuelle',
    tags: ['Branding', 'Motion', 'Figma'],
    gradient: 'from-yellow-500 via-orange-400 to-pink-500',
  },
  {
    title: 'MediConnect',
    category: 'Site Sur Mesure',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    gradient: 'from-blue-600 via-indigo-500 to-violet-600',
  },
  {
    title: 'Fleur & Co.',
    category: 'Site Vitrine',
    tags: ['Gatsby', 'Tailwind', 'GSAP'],
    gradient: 'from-rose-500 via-pink-400 to-fuchsia-500',
  },
];

const CATEGORIES = ['Tous', 'Site Vitrine', 'Site E-Commerce', 'Site Sur Mesure', 'Identite Visuelle'];

/* ──────────────── Page ──────────────── */

export default function Realisations() {
  const [active, setActive] = useState('Tous');

  const filtered = active === 'Tous'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === active);

  return (
    <>
      {/* ═════════════ Hero page ════════════ */}
      <section className="pt-36 pb-20 px-6 text-center mesh-bg relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #0ea5e9, transparent 70%)' }}
        />
        <AnimatedSection className="relative z-10">
          <span className="text-xs font-semibold tracking-[0.25em] text-cyan-400 uppercase mb-4 block">
            Portfolio
          </span>
          <h1
            className="text-5xl sm:text-6xl font-black text-white mb-5"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Nos <span className="gradient-text">réalisations</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
            Des projets ambitieux pour des clients qui voulaient plus que la moyenne.
          </p>
        </AnimatedSection>

        {/* ── Filtres */}
        <AnimatedSection delay={200} className="mt-10 flex flex-wrap justify-center gap-2 relative z-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === cat
                  ? 'gradient-bg text-white shadow-lg shadow-violet-500/25'
                  : 'glass text-white/55 hover:text-white hover:bg-white/8'
              }`}
            >
              {cat}
            </button>
          ))}
        </AnimatedSection>
      </section>

      {/* ═════════════ Grille projets ════════════ */}
      <section className="section-padding max-w-7xl mx-auto px-6">

        {/* Compteur */}
        <AnimatedSection className="mb-8 text-white/30 text-sm">
          {filtered.length} projet{filtered.length > 1 ? 's' : ''}
          {active !== 'Tous' && ` · ${active}`}
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((project, i) => (
            <AnimatedSection key={`${project.title}-${active}`} delay={i * 80}>
              <ProjectCard {...project} />
            </AnimatedSection>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            Aucun projet dans cette catégorie.
          </div>
        )}
      </section>

      {/* ═════════════ Témoignage ════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <AnimatedSection className="max-w-3xl mx-auto">
          <div className="glass rounded-3xl p-10 text-center relative overflow-hidden">
            <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
            <svg className="w-8 h-8 mx-auto mb-6 opacity-30" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d="M10 8C6.1 8 3 11.1 3 15s3.1 7 7 7c1.9 0 3.5-.7 4.8-1.9C14.3 22.6 13 26 10 28h4c4-3 5-8 5-13 0-3.9-3.1-7-7-7zm15 0c-3.9 0-7 3.1-7 7s3.1 7 7 7c1.9 0 3.5-.7 4.8-1.9C29.3 22.6 28 26 25 28h4c4-3 5-8 5-13 0-3.9-3.1-7-7-7z" />
            </svg>
            <p className="text-white/70 text-lg leading-relaxed italic mb-6">
              "AK Agency a transforme notre site e-commerce en veritable machine a vendre. Resultat : +65% de conversions en 3 mois. L'equipe est reactive, professionnelle et vraiment a l'ecoute."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                SL
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Sophie Laurent</p>
                <p className="text-white/40 text-xs">Fondatrice, Maison Leclair</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ═════════════ CTA ════════════ */}
      <section className="pb-24 px-6">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Votre projet sera le prochain
          </h2>
          <p className="text-white/50 mb-8">
            Parlons de vos ambitions. Premier echange gratuit et sans engagement.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 gradient-bg text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105"
          >
            Lancer mon projet &rarr;
          </Link>
        </AnimatedSection>
      </section>
    </>
  );
}
