/**
 * @page admin/Dashboard
 * @route /admin
 * @description Gestion des projets — CRUD complet, responsive, slug auto.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const CATEGORIES = ['Tous', 'Site Vitrine', 'Site E-Commerce', 'Site Sur Mesure', 'Identite Visuelle'];

const GRADIENTS = [
  { label: 'Violet → Pink',   value: 'from-violet-600 via-purple-500 to-pink-500' },
  { label: 'Slate → Zinc',    value: 'from-slate-700 via-slate-600 to-zinc-500' },
  { label: 'Cyan → Indigo',   value: 'from-cyan-600 via-blue-500 to-indigo-600' },
  { label: 'Amber → Red',     value: 'from-amber-600 via-orange-500 to-red-500' },
  { label: 'Emerald → Cyan',  value: 'from-emerald-600 via-teal-500 to-cyan-500' },
  { label: 'Yellow → Pink',   value: 'from-yellow-500 via-orange-400 to-pink-500' },
  { label: 'Blue → Violet',   value: 'from-blue-600 via-indigo-500 to-violet-600' },
  { label: 'Rose → Fuchsia',  value: 'from-rose-500 via-pink-400 to-fuchsia-500' },
  { label: 'Violet → Cyan',   value: 'from-violet-600 to-cyan-500' },
];

const EMPTY_FORM = {
  title:      '',
  category:   'Site Vitrine',
  tags:       '',
  gradient:   'from-violet-600 via-purple-500 to-pink-500',
  href:       '',
  is_visible: true,
  sort_order: 0,
};

/* ── Utilitaire slug ─────────────────────────────────────── */

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // supprime les accents
    .replace(/[^a-z0-9\s-]/g, '')      // garde lettres, chiffres, espaces, tirets
    .trim()
    .replace(/\s+/g, '-')              // espaces → tirets
    .replace(/-+/g, '-');              // tirets multiples → un seul
}

/* ── Styles partagés ─────────────────────────────────────── */

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all';

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-white/50 text-xs uppercase tracking-widest">{label}</label>
        {hint && <span className="text-white/25 text-xs">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ── Modal formulaire ────────────────────────────────────── */

function ProjectModal({ project, onClose, onSaved, token }) {
  const isEdit = !!project?.id;

  const [form, setForm] = useState(
    isEdit
      ? { ...project, tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags }
      : EMPTY_FORM
  );
  // Indique si l'utilisateur a modifié manuellement le champ href
  const [hrefTouched, setHrefTouched] = useState(isEdit && !!project?.href && project.href !== '#');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // Quand le titre change → auto-génère le slug dans href si pas touché manuellement
  function handleTitleChange(value) {
    set('title', value);
    if (!hrefTouched) {
      const slug = toSlug(value);
      set('href', slug ? `/realisations/${slug}` : '');
    }
  }

  function handleHrefChange(value) {
    setHrefTouched(true);
    set('href', value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Nettoie le href : si c'est un chemin relatif on le laisse tel quel,
    // si c'est vide on met '#'
    const hrefVal = form.href.trim() || '#';

    const body = {
      ...form,
      href:       hrefVal,
      tags:       form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      sort_order: parseInt(form.sort_order, 10) || 0,
    };

    // Retire la validation URL stricte pour les chemins relatifs
    // en envoyant null si ce n'est pas une URL complète (le back accepte '#')
    if (!hrefVal.startsWith('http')) {
      delete body.href; // laisse la valeur actuelle côté back ou on la gère ici
      body.href = hrefVal;
    }

    try {
      const url    = isEdit ? `${API}/projects/${project.id}` : `${API}/projects`;
      const method = isEdit ? 'PATCH' : 'POST';

      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (data.fields ? data.fields.map((f) => f.message).join(' · ') : 'Erreur.'));
        return;
      }

      onSaved(data.project);
    } catch {
      setError('Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  }

  // Ferme la modale avec Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-[#0d0f1a] border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 sm:p-7 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>
            {isEdit ? 'Modifier le projet' : 'Nouveau projet'}
          </h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Titre — génère le slug automatiquement */}
          <Field label="Titre *">
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Maison Leclair"
              className={inputCls}
            />
          </Field>

          {/* Catégorie */}
          <Field label="Catégorie *">
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
              {CATEGORIES.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          {/* Tags */}
          <Field label="Tags" hint="séparés par des virgules">
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              placeholder="React, Tailwind, Node.js"
              className={inputCls}
            />
          </Field>

          {/* Gradient */}
          <Field label="Gradient visuel">
            <div className="flex gap-3 items-center">
              <select
                value={form.gradient}
                onChange={(e) => set('gradient', e.target.value)}
                className={`${inputCls} flex-1`}
              >
                {GRADIENTS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
              <div className={`w-12 h-10 rounded-xl bg-gradient-to-br ${form.gradient} flex-shrink-0`} />
            </div>
          </Field>

          {/* URL — auto-générée depuis le titre, modifiable */}
          <Field
            label="URL du projet"
            hint={!hrefTouched && form.title ? '✦ générée auto' : 'modifiable'}
          >
            <div className="relative">
              <input
                type="text"
                value={form.href}
                onChange={(e) => handleHrefChange(e.target.value)}
                placeholder="/realisations/mon-projet"
                className={`${inputCls} ${!hrefTouched && form.href ? 'border-violet-500/30 text-violet-300' : ''}`}
              />
              {/* Bouton reset vers slug auto */}
              {hrefTouched && form.title && (
                <button
                  type="button"
                  title="Regénérer depuis le titre"
                  onClick={() => { setHrefTouched(false); set('href', `/realisations/${toSlug(form.title)}`); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-violet-400 transition-colors text-xs"
                >
                  ↺
                </button>
              )}
            </div>
          </Field>

          {/* Ordre + Visible */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ordre">
              <input
                type="number"
                min="0"
                value={form.sort_order}
                onChange={(e) => set('sort_order', e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Statut">
              <button
                type="button"
                onClick={() => set('is_visible', !form.is_visible)}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-all border ${
                  form.is_visible
                    ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                {form.is_visible ? '✓ Visible' : '✗ Masqué'}
              </button>
            </Field>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm text-white/50 bg-white/5 border border-white/8 hover:bg-white/8 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Carte projet (mobile) ───────────────────────────────── */

function ProjectCard({ project, onEdit, onDelete, onToggle }) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
      {/* Bandeau gradient */}
      <div className={`h-2 w-full bg-gradient-to-r ${project.gradient}`} />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-white/40 text-xs uppercase tracking-widest truncate">{project.category}</p>
            <h3 className="text-white font-semibold text-base mt-0.5 truncate" style={{ fontFamily: 'Syne, sans-serif' }}>
              {project.title}
            </h3>
          </div>
          {/* Visibilité */}
          <button
            onClick={() => onToggle(project)}
            className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all border ${
              project.is_visible
                ? 'bg-emerald-500/12 text-emerald-400 border-emerald-500/20'
                : 'bg-white/5 text-white/30 border-white/10'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${project.is_visible ? 'bg-emerald-400' : 'bg-white/25'}`} />
            {project.is_visible ? 'Visible' : 'Masqué'}
          </button>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-xs text-white/40 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
            {project.tags.length > 4 && <span className="text-xs text-white/25">+{project.tags.length - 4}</span>}
          </div>
        )}

        {/* URL générée */}
        {project.href && project.href !== '#' && (
          <p className="text-violet-400/60 text-xs truncate font-mono">{project.href}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1 border-t border-white/5">
          <button
            onClick={() => onEdit(project)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-white/50 hover:text-violet-400 hover:bg-violet-500/8 border border-white/8 hover:border-violet-500/20 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Modifier
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-white/50 hover:text-red-400 hover:bg-red-500/8 border border-white/8 hover:border-red-500/20 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M9 6V4h6v2" />
            </svg>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard principal ─────────────────────────────────── */

export default function Dashboard() {
  const { token }                   = useAuth();
  const [projects,  setProjects]    = useState([]);
  const [loading,   setLoading]     = useState(true);
  const [filter,    setFilter]      = useState('Tous');
  const [modal,     setModal]       = useState(null);  // null | 'create' | project
  const [deleting,  setDeleting]    = useState(null);  // project id
  const [toast,     setToast]       = useState('');

  /* ── Chargement ── */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/projects?visible=all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjects(data.projects || []);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  /* ── Toast ── */
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  /* ── Toggle visibilité ── */
  async function toggleVisible(project) {
    const res = await fetch(`${API}/projects/${project.id}/visibility`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ is_visible: !project.is_visible }),
    });
    if (res.ok) {
      setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, is_visible: !p.is_visible } : p));
      showToast(`Projet ${!project.is_visible ? 'rendu visible' : 'masqué'}.`);
    }
  }

  /* ── Suppression ── */
  async function confirmDelete(id) {
    const res = await fetch(`${API}/projects/${id}`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast('Projet supprimé.');
    }
    setDeleting(null);
  }

  /* ── Après sauvegarde ── */
  function onSaved(saved) {
    setProjects((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      return exists
        ? prev.map((p) => p.id === saved.id ? saved : p)
        : [saved, ...prev];
    });
    setModal(null);
    showToast(modal?.id ? 'Projet mis à jour.' : 'Projet créé.');
  }

  const displayed = filter === 'Tous'
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* ── En-tête ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-black text-xl sm:text-2xl" style={{ fontFamily: 'Syne, sans-serif' }}>Projets</h1>
          <p className="text-white/35 text-xs sm:text-sm mt-0.5">
            {projects.length} projet{projects.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="hidden sm:inline">Nouveau projet</span>
          <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      {/* ── Filtres ── */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === cat
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'bg-white/4 text-white/40 border border-white/8 hover:text-white hover:bg-white/8'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Contenu ── */}
      {loading ? (
        <div className="text-white/30 text-sm py-16 text-center">Chargement…</div>
      ) : displayed.length === 0 ? (
        <div className="text-white/30 text-sm py-16 text-center">Aucun projet dans cette catégorie.</div>
      ) : (
        <>
          {/* Vue carte — mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {displayed.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={setModal}
                onDelete={setDeleting}
                onToggle={toggleVisible}
              />
            ))}
          </div>

          {/* Vue tableau — desktop */}
          <div className="hidden lg:block border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8 text-left">
                  {['Visuel', 'Titre', 'Catégorie', 'Tags', 'Lien', 'Ordre', 'Statut', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-white/35 text-xs uppercase tracking-widest font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((project, i) => (
                  <tr
                    key={project.id}
                    className={`border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors ${i % 2 === 0 ? '' : 'bg-white/1'}`}
                  >
                    {/* Visuel */}
                    <td className="px-4 py-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.gradient} flex-shrink-0`} />
                    </td>

                    {/* Titre */}
                    <td className="px-4 py-3">
                      <span className="text-white text-sm font-medium">{project.title}</span>
                    </td>

                    {/* Catégorie */}
                    <td className="px-4 py-3">
                      <span className="text-white/50 text-xs">{project.category}</span>
                    </td>

                    {/* Tags */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-white/40 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                        {project.tags.length > 3 && <span className="text-xs text-white/25">+{project.tags.length - 3}</span>}
                      </div>
                    </td>

                    {/* Lien */}
                    <td className="px-4 py-3 max-w-[180px]">
                      <span className="text-violet-400/60 text-xs font-mono truncate block" title={project.href}>
                        {project.href && project.href !== '#' ? project.href : <span className="text-white/20">—</span>}
                      </span>
                    </td>

                    {/* Ordre */}
                    <td className="px-4 py-3 text-white/35 text-sm">{project.sort_order}</td>

                    {/* Statut */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleVisible(project)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all border ${
                          project.is_visible
                            ? 'bg-emerald-500/12 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-white/5 text-white/30 border-white/10 hover:bg-white/8'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${project.is_visible ? 'bg-emerald-400' : 'bg-white/25'}`} />
                        {project.is_visible ? 'Visible' : 'Masqué'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModal(project)}
                          className="p-1.5 text-white/30 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all"
                          title="Modifier"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleting(project.id)}
                          className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Supprimer"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Modal formulaire ── */}
      {modal && (
        <ProjectModal
          project={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={onSaved}
          token={token}
        />
      )}

      {/* ── Confirmation suppression ── */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleting(null)} />
          <div className="relative bg-[#0d0f1a] border border-white/10 rounded-2xl p-6 sm:p-7 w-full max-w-sm text-center flex flex-col gap-5">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M9 6V4h6v2" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>Supprimer ce projet ?</h3>
              <p className="text-white/40 text-sm mt-1">Cette action est irréversible.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)}
                className="flex-1 py-2.5 rounded-xl text-sm text-white/50 bg-white/5 border border-white/8 hover:bg-white/8 transition-all">
                Annuler
              </button>
              <button onClick={() => confirmDelete(deleting)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500/80 hover:bg-red-500 transition-all">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm px-4 sm:px-5 py-3 rounded-xl shadow-xl backdrop-blur-md">
          {toast}
        </div>
      )}
    </div>
  );
}
