/**
 * @component Footer
 * @description Pied de page complet avec :
 *   - Logo + description de l'agence
 *   - Liens rapides (navigation)
 *   - Services proposés
 *   - Coordonnées de contact
 *   - Bande de copyright + mentions légales
 */

import { Link } from 'react-router-dom';

const SERVICES = [
  'Site Vitrine',
  'Site Sur Mesure',
  'Site E-Commerce',
  'Identité Visuelle',
];

const QUICK_LINKS = [
  { label: 'Accueil',       to: '/'             },
  { label: 'Services',      to: '/services'     },
  { label: 'Réalisations',  to: '/realisations' },
  { label: 'Contact',       to: '/contact'      },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/6 bg-[#030610]">

      {/* ── Corps du footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Colonne 1 — Identité */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-1.5 mb-5">
            <span className="text-xl font-black gradient-text" style={{ fontFamily: 'Syne, sans-serif' }}>AK</span>
            <span className="text-xl font-light text-white/50 tracking-widest text-xs uppercase" style={{ fontFamily: 'Syne, sans-serif' }}>Agency</span>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed">
            Agence digitale spécialisée dans la création de sites web modernes et l'identité visuelle d'entreprise.
          </p>
          {/* Réseaux sociaux */}
          <div className="flex gap-3 mt-6">
            {[
              {
                href: '#',
                label: 'Instagram',
                icon: (
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M6.5 6.5h11A1.5 1.5 0 0 1 19 8v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 16V8A1.5 1.5 0 0 1 6.5 6.5Z" />
                ),
              },
              {
                href: '#',
                label: 'LinkedIn',
                icon: (
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zm2-4a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                ),
              },
              {
                href: '#',
                label: 'X (Twitter)',
                icon: (
                  <path d="M4 4l16 16M4 20 20 4" />
                ),
              },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/40 hover:text-white hover:border-violet-500/40 transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Colonne 2 — Liens rapides */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">Navigation</h3>
          <ul className="space-y-3">
            {QUICK_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-white/50 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-4 h-px bg-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne 3 — Services */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">Services</h3>
          <ul className="space-y-3">
            {SERVICES.map((service) => (
              <li key={service}>
                <Link
                  to="/services"
                  className="text-white/50 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-4 h-px bg-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  {service}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne 4 — Contact */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">Contact</h3>
          <ul className="space-y-4">
            {[
              { icon: '✉', text: 'contact@akagency.fr' },
              { icon: '📞', text: '+33 1 23 45 67 89'  },
              { icon: '📍', text: 'Paris, France'       },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/50 text-sm">
                <span className="text-base">{icon}</span>
                {text}
              </li>
            ))}
          </ul>

          {/* Badge dispo */}
          <div className="mt-6 inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs text-white/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Disponible pour nouveaux projets
          </div>
        </div>
      </div>

      {/* ── Bande copyright */}
      <div className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
          <span>© {year} AK Agency — Tous droits réservés</span>
          <div className="flex items-center gap-4">
            <Link to="/mentions-legales" className="hover:text-white/60 transition-colors">
              Mentions légales & CGV
            </Link>
            <span>·</span>
            <span>Fait avec ♥ en France</span>
            <span>·</span>
            <Link
              to="/admin/login"
              className="text-white/10 hover:text-white/30 transition-colors duration-300 text-xs"
              title="Administration"
            >
              ⚙
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
