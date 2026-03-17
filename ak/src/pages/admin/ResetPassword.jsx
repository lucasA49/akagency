/**
 * @page admin/ResetPassword
 * @route /admin/reset-password?token=xxx
 * @description Formulaire de définition d'un nouveau mot de passe.
 * Le token est lu depuis l'URL (?token=...).
 */

import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const RULES = [
  { test: (p) => p.length >= 8,           label: '8 caractères minimum' },
  { test: (p) => /[A-Z]/.test(p),         label: 'Une majuscule' },
  { test: (p) => /[0-9]/.test(p),         label: 'Un chiffre' },
  { test: (p) => /[^A-Za-z0-9]/.test(p),  label: 'Un caractère spécial' },
];

export default function ResetPassword() {
  const [searchParams]               = useSearchParams();
  const token                        = searchParams.get('token') || '';

  const [password,  setPassword]  = useState('');
  const [password2, setPassword2] = useState('');
  const [showPwd,   setShowPwd]   = useState(false);
  const [done,      setDone]      = useState(false);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const allValid   = RULES.every((r) => r.test(password));
  const matchError = password2 && password !== password2;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!allValid || matchError) return;
    setError('');
    setLoading(true);

    try {
      const res  = await fetch(`${API}/auth/reset-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }

      setDone(true);
    } catch {
      setError('Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#050711] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">Lien invalide ou expiré.</p>
          <Link to="/admin/forgot-password" className="text-violet-400 text-sm hover:text-violet-300">
            Faire une nouvelle demande
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050711] flex items-center justify-center px-4">
      <div
        aria-hidden="true"
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #7c3aed, transparent 70%)' }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <span className="text-white font-black text-3xl tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            AK <span className="text-violet-400">Admin</span>
          </span>
        </div>

        <div className="bg-white/4 border border-white/8 rounded-2xl p-8 flex flex-col gap-5">

          {done ? (
            <div className="text-center flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>Mot de passe mis à jour !</h2>
                <p className="text-white/40 text-sm mt-1">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
              </div>
              <Link
                to="/admin/login"
                className="px-6 py-2.5 rounded-full text-white text-sm font-semibold transition-all"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
              >
                Se connecter
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-white font-bold text-xl" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Nouveau mot de passe
                </h1>
                <p className="text-white/40 text-sm mt-1">Choisissez un mot de passe fort.</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Nouveau mot de passe */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/50 text-xs uppercase tracking-widest">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowPwd((v) => !v)} tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {showPwd
                          ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                          : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                        }
                      </svg>
                    </button>
                  </div>

                  {/* Indicateurs de force */}
                  {password && (
                    <div className="grid grid-cols-2 gap-1.5 mt-1">
                      {RULES.map(({ test, label }) => (
                        <div key={label} className={`flex items-center gap-1.5 text-xs transition-colors ${test(password) ? 'text-emerald-400' : 'text-white/25'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${test(password) ? 'bg-emerald-400' : 'bg-white/15'}`} />
                          {label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirmation */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/50 text-xs uppercase tracking-widest">Confirmer</label>
                  <input
                    type="password"
                    required
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="••••••••"
                    className={`bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none transition-all ${
                      matchError ? 'border-red-500/50 focus:border-red-500/70' : 'border-white/10 focus:border-violet-500/50'
                    }`}
                  />
                  {matchError && <p className="text-red-400 text-xs">Les mots de passe ne correspondent pas.</p>}
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !allValid || !!matchError || !password2}
                  className="w-full py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-40 transition-all"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                >
                  {loading ? 'Enregistrement…' : 'Enregistrer le mot de passe'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
