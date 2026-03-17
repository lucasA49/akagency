/**
 * @page Home
 * @route /
 * @description Page d'accueil de l'agence AK Agency.
 *
 * Sections :
 *  1. Hero           — Accroche principale, CTA primaire
 *  2. Ticker         — Bande défilante (services)
 *  3. Services       — Aperçu des 4 offres
 *  4. Stats          — Compteurs animés
 *  5. Process        — Méthode de travail en 4 étapes
 *  6. CTA Banner     — Appel à l'action final
 */

import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import ServiceCard     from '../components/ServiceCard';
import CountUp         from '../components/CountUp';

/* ──────────────── Données ──────────────── */

const SERVICES = [
  {
    color: 'purple',
    title: 'Site Vitrine',
    description: 'Présentez votre activité avec élégance. Un site qui reflète votre image et convertit vos visiteurs en clients.',
    features: ['Design sur mesure', 'Responsive mobile-first', 'SEO optimisé', 'CMS intégré'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    color: 'cyan',
    title: 'Site Sur Mesure',
    description: 'Des solutions digitales uniques, architecturées selon vos processus métier et vos ambitions.',
    features: ['Architecture scalable', 'Fonctionnalités custom', 'Intégrations API', 'Performance maximale'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    color: 'pink',
    title: 'Site E-Commerce',
    description: "Vendez en ligne avec puissance. Une boutique performante qui maximise votre chiffre d'affaires.",
    features: ['Paiement sécurisé', 'Catalogue produits', 'Gestion des stocks', 'Analytics avancés'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    color: 'emerald',
    title: 'Identité Visuelle',
    description: 'Logo, charte graphique, supports de communication — bâtissez une marque reconnaissable et mémorable.',
    features: ['Logo & déclinaisons', 'Charte graphique', 'Supports print & digital', 'Guide de marque'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
];

const STATS = [
  { end: 50,  suffix: '+', label: 'Projets réalisés'       },
  { end: 5,   suffix: '+', label: "Années d'expérience"    },
  { end: 98,  suffix: '%', label: 'Clients satisfaits'     },
  { end: 24,  suffix: 'h', label: 'Délai de réponse moyen' },
];

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Analyse & Stratégie',
    description: "On écoute votre vision, on analyse vos besoins et votre marché pour poser des bases solides.",
  },
  {
    num: '02',
    title: 'Design & Prototypage',
    description: "Maquettes interactives, choix typographiques et pallettes couleurs — vous validez avant qu'on code.",
  },
  {
    num: '03',
    title: 'Développement',
    description: "Code propre, performance optimale, accessibilité au cœur de chaque ligne.",
  },
  {
    num: '04',
    title: 'Lancement & Support',
    description: "Mise en ligne soignée, formation et accompagnement continu pour votre succès.",
  },
];

const TICKER_ITEMS = [
  'Site Vitrine', '✦', 'E-Commerce', '✦', 'Sur Mesure', '✦',
  'Identité Visuelle', '✦', 'Design UI/UX', '✦', 'SEO', '✦',
  'Performance Web', '✦', 'Branding', '✦',
];

/* ──────────────── Composant ──────────────── */

export default function Home() {
  return (
    <>
      {/* ═══════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-bg">

        {/* ── Orbes décoratifs */}
        <div
          aria-hidden="true"
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-15 animate-pulse-glow pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 animate-pulse-glow pointer-events-none"
          style={{ background: 'radial-gradient(circle, #0ea5e9, transparent 70%)', animationDelay: '2s' }}
        />

        {/* ── Grille décorative */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* ── Contenu */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8 text-sm text-white/70"
            style={{ opacity: 0, animation: 'fadeUp .8s .1s ease forwards' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Agence Web · Paris · Disponible
          </div>

          {/* Titre */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight mb-6"
            style={{ fontFamily: 'Syne, sans-serif', opacity: 0, animation: 'fadeUp .9s .25s ease forwards' }}
          >
            Créons votre{' '}
            <span className="gradient-text">présence</span>
            <br />
            digitale
          </h1>

          {/* Sous-titre */}
          <p
            className="text-lg sm:text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ opacity: 0, animation: 'fadeUp .9s .4s ease forwards' }}
          >
            AK Agency conçoit des sites web modernes, des boutiques e-commerce
            et des identités visuelles qui font la différence pour votre business.
          </p>

          {/* CTA */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ opacity: 0, animation: 'fadeUp .9s .55s ease forwards' }}
          >
            <Link
              to="/contact"
              className="gradient-bg text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 flex items-center gap-2"
            >
              Démarrer un projet
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M1 8h14M8 1l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              to="/realisations"
              className="glass text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:border-white/20 hover:bg-white/8"
            >
              Voir nos réalisations
            </Link>
          </div>

          {/* Social proof */}
          <p
            className="mt-10 text-sm text-white/30"
            style={{ opacity: 0, animation: 'fadeUp .9s .7s ease forwards' }}
          >
            Rejoignez + de 50 entreprises qui nous font confiance
          </p>
        </div>

        {/* ── Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 text-xs">
          <span>Défiler</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. TICKER
      ═══════════════════════════════════════════ */}
      <div className="py-5 border-y border-white/6 overflow-hidden bg-white/[0.02]" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-white/30 text-sm font-medium mx-6 whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          3. SERVICES
      ═══════════════════════════════════════════ */}
      <section className="section-padding max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-violet-400 uppercase mb-3 block">
            Nos Services
          </span>
          <h2
            className="text-4xl sm:text-5xl font-black text-white"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Ce que nous créons
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto text-base">
            Des solutions digitales pensées pour performer, convertir et marquer les esprits.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service, i) => (
            <AnimatedSection key={service.title} delay={i * 100}>
              <ServiceCard {...service} to="/services" />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={400} className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-300 group"
          >
            Découvrir tous nos services
            <span className="gradient-text group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </AnimatedSection>
      </section>

      {/* ═══════════════════════════════════════════
          4. STATS
      ═══════════════════════════════════════════ */}
      <section className="py-20 border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 100} className="text-center">
              <div
                className="text-4xl sm:text-5xl font-black gradient-text mb-2"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                <CountUp end={stat.end} suffix={stat.suffix} />
              </div>
              <p className="text-white/45 text-sm">{stat.label}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. PROCESS
      ═══════════════════════════════════════════ */}
      <section className="section-padding max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-cyan-400 uppercase mb-3 block">
            Notre Méthode
          </span>
          <h2
            className="text-4xl sm:text-5xl font-black text-white"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Comment on travaille
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto text-base">
            Un processus éprouvé, transparent et centré sur vos résultats.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Ligne de connexion (desktop) */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-violet-500/0 via-violet-500/30 to-violet-500/0"
          />

          {PROCESS_STEPS.map((step, i) => (
            <AnimatedSection key={step.num} delay={i * 120}>
              <div className="glass rounded-2xl p-6 flex flex-col gap-4 hover:border-white/15 transition-colors duration-300 h-full">
                <span className="text-4xl font-black gradient-text opacity-60" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {step.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">{step.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl gradient-bg-animated p-px">
            <div className="rounded-3xl p-12 sm:p-16 text-center bg-[#050711]/80 backdrop-blur-sm">
              {/* Orbe déco */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}
              />
              <h2
                className="text-4xl sm:text-5xl font-black text-white mb-4 relative"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Votre projet commence <span className="gradient-text">ici</span>
              </h2>
              <p className="text-white/55 mb-8 max-w-lg mx-auto text-base">
                Parlons de votre vision. Réponse garantie sous 24h.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-[#050711] font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 hover:scale-105"
              >
                Prendre contact gratuitement
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M1 8h14M8 1l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
