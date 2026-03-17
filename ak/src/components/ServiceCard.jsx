/**
 * @component ServiceCard
 * @description Carte présentant un service de l'agence.
 *
 * @param {ReactNode} icon        Icône SVG du service.
 * @param {string}    title       Titre du service.
 * @param {string}    description Courte description.
 * @param {string[]}  features    Liste de fonctionnalités incluses.
 * @param {string}    color       Couleur d'accent ('purple' | 'cyan' | 'pink' | 'emerald').
 * @param {string}    to          Route vers laquelle pointe le CTA.
 *
 * @example
 * <ServiceCard
 *   icon={<MonIcon />}
 *   title="Site E-Commerce"
 *   description="Vendez en ligne"
 *   features={['Paiement sécurisé', 'Catalogue produits']}
 *   color="cyan"
 *   to="/services"
 * />
 */

import { Link } from 'react-router-dom';

const COLOR_MAP = {
  purple:  { glow: 'rgba(124,58,237,0.25)',  text: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20'  },
  cyan:    { glow: 'rgba(14,165,233,0.25)',  text: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20'    },
  pink:    { glow: 'rgba(236,72,153,0.25)',  text: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20'    },
  emerald: { glow: 'rgba(16,185,129,0.25)',  text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
};

export default function ServiceCard({ icon, title, description, features = [], color = 'purple', to = '/services' }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.purple;

  return (
    <div
      className="glass rounded-2xl p-8 flex flex-col gap-5 card-hover group"
      style={{ '--glow-color': c.glow }}
    >
      {/* Icône */}
      <div className={`w-14 h-14 ${c.bg} rounded-xl flex items-center justify-center ${c.text} transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>

      {/* Texte */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          {title}
        </h3>
        <p className="text-white/55 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Fonctionnalités */}
      {features.length > 0 && (
        <ul className="flex flex-col gap-2 mt-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-white/50">
              <span className={`w-1.5 h-1.5 rounded-full ${c.text.replace('text', 'bg')} flex-shrink-0`} />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <Link
        to={to}
        className={`mt-auto inline-flex items-center gap-1.5 text-sm font-semibold ${c.text} group-hover:gap-3 transition-all duration-300`}
      >
        En savoir plus
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
