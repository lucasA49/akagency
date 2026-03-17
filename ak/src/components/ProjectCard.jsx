/**
 * @component ProjectCard
 * @description Carte portfolio affichant un projet réalisé.
 *   Affiche une image placeholder stylisée, le titre, la catégorie
 *   et les tags technologiques.
 *
 * @param {string}   title     Nom du projet.
 * @param {string}   category  Catégorie (ex: 'Site E-Commerce').
 * @param {string[]} tags      Technologies utilisées.
 * @param {string}   gradient  Gradient CSS pour le placeholder visuel.
 * @param {string}   href      Lien externe vers le projet (optionnel).
 *
 * @example
 * <ProjectCard
 *   title="Maison Rousseau"
 *   category="Site E-Commerce"
 *   tags={['React', 'Stripe', 'Tailwind']}
 *   gradient="from-violet-600 to-cyan-500"
 * />
 */

export default function ProjectCard({ title, category, tags = [], gradient = 'from-violet-600 to-cyan-500', href = '#' }) {
  return (
    <div className="glass rounded-2xl overflow-hidden card-hover group">

      {/* Visuel */}
      <div className={`relative h-52 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Pattern géométrique décoratif */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-24 h-24 rounded-full border border-white/40 animate-spin-slow" />
          <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full border border-white/30" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/10" />
        </div>

        {/* Overlay au hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 glass text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2"
          >
            Voir le projet
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* Informations */}
      <div className="p-6 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-medium text-white/40 uppercase tracking-widest">{category}</span>
            <h3 className="text-lg font-bold text-white mt-1" style={{ fontFamily: 'Syne, sans-serif' }}>{title}</h3>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-white/50 bg-white/5 border border-white/8 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
