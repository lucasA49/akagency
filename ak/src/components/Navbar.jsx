/**
 * @component Navbar
 * @description Barre de navigation principale.
 *   - Transparente au sommet, effet verre (glass morphism) au scroll.
 *   - Indicateur de route active avec underline animé.
 *   - Menu hamburger responsive pour mobile.
 *   - Se referme automatiquement au changement de route.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Accueil',       to: '/'             },
  { label: 'Services',      to: '/services'     },
  { label: 'Réalisations',  to: '/realisations' },
  { label: 'Contact',       to: '/contact'      },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  /* ── Effet verre au scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Fermeture du menu mobile au changement de route */
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-white/5 py-3'
          : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* ── Logo */}
        <Link to="/" className="flex items-center gap-1.5 group">
          <span
            className="text-2xl font-black gradient-text"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            AK
          </span>
          <span
            className="text-2xl font-light text-white/60 tracking-[0.3em] uppercase text-sm"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Agency
          </span>
        </Link>

        {/* ── Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`relative text-sm font-medium transition-colors duration-300 group ${
                isActive(to) ? 'text-white' : 'text-white/55 hover:text-white'
              }`}
            >
              {label}
              {/* Underline animé */}
              <span
                className={`absolute -bottom-0.5 left-0 h-[2px] gradient-bg rounded-full transition-all duration-300 ${
                  isActive(to) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* ── CTA desktop */}
        <Link
          to="/contact"
          className="hidden md:inline-flex items-center gap-2 gradient-bg text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105"
        >
          Démarrer un projet
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* ── Hamburger mobile */}
        <button
          className="md:hidden p-2 flex flex-col gap-1.5"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* ── Menu mobile */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav
          className="glass border-t border-white/5 px-6 py-5 flex flex-col gap-1"
          aria-label="Navigation mobile"
        >
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(to)
                  ? 'text-white bg-white/6'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="mt-3 gradient-bg text-white text-sm font-semibold px-5 py-3.5 rounded-full text-center transition-all hover:opacity-90"
          >
            Démarrer un projet →
          </Link>
        </nav>
      </div>
    </header>
  );
}
