/**
 * @layout AdminLayout
 * @description Layout du panel admin — sidebar desktop + drawer mobile.
 * Responsive : hamburger menu sur mobile, sidebar fixe sur desktop.
 */

import { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  {
    to: '/admin',
    label: 'Projets',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
];

function SidebarContent({ user, onLogout, onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/6 flex items-center justify-between">
        <div>
          <span className="text-white font-black text-xl tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            AK <span className="text-violet-400">Admin</span>
          </span>
          <p className="text-white/30 text-xs mt-0.5 truncate max-w-[160px]">{user?.email}</p>
        </div>
        {/* Bouton fermer — mobile uniquement */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white/30 hover:text-white transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer sidebar */}
      <div className="px-3 py-4 border-t border-white/6 flex flex-col gap-1">
        <Link
          to="/"
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Voir le site
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen flex bg-[#050711]">

      {/* ── Sidebar desktop (fixe, visible lg+) ─── */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-white/6 flex-col">
        <SidebarContent user={user} onLogout={handleLogout} onClose={null} />
      </aside>

      {/* ── Drawer mobile ──────────────────────── */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Panneau */}
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0c1a] border-r border-white/8 flex flex-col lg:hidden">
            <SidebarContent
              user={user}
              onLogout={handleLogout}
              onClose={() => setDrawerOpen(false)}
            />
          </aside>
        </>
      )}

      {/* ── Zone principale ─────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">

        {/* Header mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-white/6 sticky top-0 z-30 bg-[#050711]">
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-white/50 hover:text-white transition-colors p-1"
            aria-label="Ouvrir le menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="text-white font-black text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>
            AK <span className="text-violet-400">Admin</span>
          </span>
          <Link to="/" className="text-white/30 hover:text-white transition-colors p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </Link>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
