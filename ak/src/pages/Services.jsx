/**
 * @page Services
 * @route /services
 * @description Page détaillant les 4 offres de l'agence.
 *
 * Sections :
 *  1. Hero page        — Titre + sous-titre
 *  2. Grille services  — 4 cartes détaillées
 *  3. Pourquoi nous    — Arguments différenciants
 *  4. FAQ              — Questions fréquentes
 *  5. CTA              — Appel à l'action
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import ServiceCard     from '../components/ServiceCard';

/* ──────────────── Données ──────────────── */

const SERVICES_DETAIL = [
  {
    color: 'purple',
    title: 'Site Vitrine',
    description:
      "Votre site vitrine est votre vitrine numérique — souvent le premier contact avec vos prospects. Nous concevons des sites qui inspirent confiance, racontent votre histoire et transforment les visiteurs en clients.",
    features: [
      'Design 100 % sur mesure',
      'Mobile-first & responsive',
      'SEO technique optimisé',
      'Intégration CMS (Sanity, Contentful…)',
      'Animations fluides',
      'Hébergement & maintenance',
    ],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    color: 'cyan',
    title: 'Site Sur Mesure',
    description:
      "Votre business a des besoins spécifiques ? Nous architecturons des applications web robustes et évolutives, parfaitement adaptées à vos processus métier et à vos utilisateurs.",
    features: [
      'Architecture scalable',
      'Fonctionnalités sur mesure',
      'Intégrations API tierces',
      'Authentification & rôles',
      'Dashboard & backoffice',
      'Tests & documentation',
    ],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    color: 'pink',
    title: 'Site E-Commerce',
    description:
      "Vendez en ligne avec une boutique qui performe. Interface intuitive, paiement sécurisé et gestion des stocks fluide — tout pour maximiser votre chiffre d'affaires.",
    features: [
      'Catalogue produits illimité',
      'Paiement multi-devises (Stripe)',
      'Gestion commandes & stocks',
      'Avis clients & fidélisation',
      'Analytics & tableau de bord',
      'Optimisation conversion (CRO)',
    ],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    color: 'emerald',
    title: 'Identité Visuelle',
    description:
      "Une marque forte est la fondation de tout le reste. Nous créons des identités visuelles cohérentes et mémorables qui vous distinguent dans votre secteur.",
    features: [
      'Logo & déclinaisons',
      'Palette couleurs & typographie',
      'Charte graphique complète',
      'Supports print & digital',
      'Templates réseaux sociaux',
      'Guide de marque (brand book)',
    ],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
];

const WHY_US = [
  { icon: '⚡', title: 'Rapidité', desc: 'Délais tenus, livraison dans les temps. Toujours.' },
  { icon: '🎯', title: 'Résultats', desc: "On ne fait pas du beau pour le beau — on vise la performance et la conversion." },
  { icon: '🔒', title: 'Sécurité', desc: "Code audité, HTTPS, protection des données et conformité RGPD systématiques." },
  { icon: '🤝', title: 'Transparence', desc: "Point régulier, accès au repo, aucune surprise cachée sur la facture." },
  { icon: '♾️', title: 'Évolutivité', desc: "Vos besoins grandissent ? Votre site aussi. On bâtit pour durer." },
  { icon: '🌟', title: 'Excellence', desc: "Chaque pixel, chaque ligne de code : la qualité n'est pas négociable." },
];

const FAQ = [
  { q: 'Quel est le délai moyen de réalisation ?', a: "Un site vitrine prend 3 à 6 semaines, un e-commerce 6 à 10 semaines. Les projets sur mesure sont estimés au cas par cas lors du devis." },
  { q: 'Proposez-vous la maintenance après livraison ?', a: "Oui, des contrats de maintenance mensuelle sont disponibles (mises à jour, sauvegardes, monitoring, évolutions mineures)." },
  { q: 'Je peux modifier mon site moi-même ?', a: "Absolument. On intègre systématiquement un CMS simple d'utilisation et on vous forme à son usage." },
  { q: "Mon budget est limité, pouvez-vous m'aider quand même ?", a: "On s'adapte. Dites-nous votre budget lors de la prise de contact et on trouvera ensemble la meilleure approche." },
];

/* ──────────────── Composant FAQ Item ──────────────── */

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/8">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className="text-white font-medium text-sm sm:text-base group-hover:text-violet-300 transition-colors duration-300">
          {q}
        </span>
        <span className={`text-white/40 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-45' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-48 pb-5' : 'max-h-0'}`}>
        <p className="text-white/50 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ──────────────── Page ──────────────── */

export default function Services() {
  return (
    <>
      {/* ═════════════ Hero page ════════════ */}
      <section className="pt-36 pb-20 px-6 text-center mesh-bg relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse, #7c3aed, transparent 70%)' }} />
        <AnimatedSection className="relative z-10">
          <span className="text-xs font-semibold tracking-[0.25em] text-violet-400 uppercase mb-4 block">Services</span>
          <h1
            className="text-5xl sm:text-6xl font-black text-white mb-5"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Nos <span className="gradient-text">expertises</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
            De la stratégie au lancement, on couvre l'ensemble de votre présence digitale.
          </p>
        </AnimatedSection>
      </section>

      {/* ═════════════ Services détaillés ════════════ */}
      <section className="section-padding max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SERVICES_DETAIL.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 100} animation={i % 2 === 0 ? 'reveal-left' : 'reveal-right'}>
              <ServiceCard {...s} to="/contact" />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ═════════════ Pourquoi nous ════════════ */}
      <section className="section-padding border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-xs font-semibold tracking-[0.25em] text-cyan-400 uppercase mb-3 block">Pourquoi AK Agency</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Ce qui nous distingue
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 80}>
                <div className="glass rounded-2xl p-6 flex gap-4 hover:border-white/15 transition-colors duration-300 h-full">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold mb-1.5">{item.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════ FAQ ════════════ */}
      <section className="section-padding border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.25em] text-violet-400 uppercase mb-3 block">FAQ</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Questions fréquentes
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            <div className="glass rounded-2xl px-6 sm:px-8">
              {FAQ.map((item) => (
                <FaqItem key={item.q} {...item} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═════════════ CTA ════════════ */}
      <section className="pb-24 px-6">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Prêt à démarrer ?
          </h2>
          <p className="text-white/50 mb-8">Obtenez un devis gratuit et personnalisé en moins de 48h.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 gradient-bg text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105"
          >
            Demander un devis gratuit →
          </Link>
        </AnimatedSection>
      </section>
    </>
  );
}
