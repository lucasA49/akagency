 /**
 * @page Contact
 * @route /contact
 * @description Page de contact avec formulaire complet et informations pratiques.
 *
 * Sections :
 *  1. Hero page    — Titre + sous-titre
 *  2. Grille       — Formulaire (gauche) + Infos (droite)
 *  3. Carte FAQ    — Liens rapides vers la FAQ Services
 */

import { Link }       from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import ContactForm     from '../components/ContactForm';

/* ──────────────── Infos de contact ──────────────── */

const CONTACT_INFO = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.92 12 19.79 19.79 0 0 1 1.92 3.38 2 2 0 0 1 3.89 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 7 7l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 23 17z" />
      </svg>
    ),
    label: 'Telephone',
    value: '+33 1 23 45 67 89',
    href: 'tel:+33123456789',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email',
    value: 'contact@akagency.fr',
    href: 'mailto:contact@akagency.fr',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Adresse',
    value: '75001 Paris, France',
    href: '#',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: 'Disponibilite',
    value: 'Lun – Ven, 9h – 18h',
    href: '#',
  },
];

/* ──────────────── Page ──────────────── */

export default function Contact() {
  return (
    <>
      {/* ═════════════ Hero page ════════════ */}
      <section className="pt-36 pb-16 px-6 text-center mesh-bg relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #7c3aed, transparent 70%)' }}
        />
        <AnimatedSection className="relative z-10">
          <span className="text-xs font-semibold tracking-[0.25em] text-violet-400 uppercase mb-4 block">
            Contact
          </span>
          <h1
            className="text-5xl sm:text-6xl font-black text-white mb-5"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Parlons de votre <span className="gradient-text">projet</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
            Remplissez le formulaire ou contactez-nous directement.
            On vous repond sous 24h, garanti.
          </p>
        </AnimatedSection>
      </section>

      {/* ═════════════ Grille formulaire / infos ════════════ */}
      <section className="section-padding max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Formulaire — col 3/5 */}
          <AnimatedSection animation="reveal-left" className="lg:col-span-3">
            <div className="glass rounded-3xl p-8 sm:p-10 h-full">
              <h2
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Envoyer un message
              </h2>
              <p className="text-white/40 text-sm mb-8">
                Tous les champs marques * sont obligatoires.
              </p>
              <ContactForm />
            </div>
          </AnimatedSection>

          {/* Infos — col 2/5 */}
          <AnimatedSection animation="reveal-right" delay={100} className="lg:col-span-2 flex flex-col gap-5">

            {/* Coordonnees */}
            <div className="glass rounded-3xl p-8 flex flex-col gap-6">
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Coordonnees
              </h2>
              {CONTACT_INFO.map(({ icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 glass rounded-xl flex items-center justify-center text-violet-400 flex-shrink-0 group-hover:bg-violet-500/15 transition-colors duration-300">
                    {icon}
                  </div>
                  <div>
                    <p className="text-white/35 text-xs uppercase tracking-widest mb-0.5">{label}</p>
                    <p className="text-white text-sm font-medium group-hover:text-violet-300 transition-colors duration-300">
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Dispo + badge */}
            <div className="glass rounded-3xl p-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="text-emerald-400 font-semibold text-sm">Disponible pour nouveaux projets</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                Notre equipe est prete a etudier votre projet.
                Reponse garantie sous 24 heures ouvrables.
              </p>
              <div className="h-px bg-white/6" />
              <div className="flex flex-col gap-3">
                {['Devis gratuit et sans engagement', 'Accompagnement de A a Z', 'Technologies modernes 2026'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/55">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Lien FAQ */}
            <Link
              to="/services"
              className="glass rounded-3xl p-6 flex items-center justify-between group hover:border-white/15 transition-all duration-300"
            >
              <div>
                <p className="text-white font-semibold text-sm mb-0.5">Des questions ?</p>
                <p className="text-white/40 text-xs">Consultez notre FAQ</p>
              </div>
              <svg
                width="20" height="20" viewBox="0 0 20 20" fill="none"
                className="text-white/30 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-300"
              >
                <path d="M1 10h18M10 1l9 9-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
