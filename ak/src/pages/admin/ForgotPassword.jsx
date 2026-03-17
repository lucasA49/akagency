/**
 * @page admin/ForgotPassword
 * @route /admin/forgot-password
 * @description Formulaire de demande de réinitialisation du mot de passe.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res  = await fetch(`${API}/auth/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }

      setSent(true);
    } catch {
      setError('Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
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

          {sent ? (
            /* ── État : email envoyé ── */
            <div className="text-center flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>Email envoyé !</h2>
                <p className="text-white/40 text-sm mt-1 leading-relaxed">
                  Si un compte existe pour <strong className="text-white/60">{email}</strong>,
                  vous recevrez un lien de réinitialisation sous quelques minutes.
                </p>
              </div>
              <p className="text-white/25 text-xs">Le lien est valable 60 minutes.</p>
              <Link to="/admin/login" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
                ← Retour à la connexion
              </Link>
            </div>
          ) : (
            /* ── Formulaire ── */
            <>
              <div>
                <h1 className="text-white font-bold text-xl" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Mot de passe oublié
                </h1>
                <p className="text-white/40 text-sm mt-1">
                  Saisissez votre email — un lien de réinitialisation vous sera envoyé.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/50 text-xs uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="lucasaksu@gmail.com"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                >
                  {loading ? 'Envoi…' : 'Envoyer le lien'}
                </button>
              </form>

              <Link to="/admin/login" className="text-center text-xs text-white/30 hover:text-violet-400 transition-colors">
                ← Retour à la connexion
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
