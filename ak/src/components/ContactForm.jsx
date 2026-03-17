/**
 * @component ContactForm
 * @description Formulaire de contact complet avec validation côté client
 *   et retour visuel (succès / erreur).
 *
 * Champs : Prénom + Nom, Email, Téléphone (optionnel), Service souhaité,
 *          Budget estimatif, Message.
 *
 * Note : L'envoi réel nécessite un backend ou un service comme Resend / Formspree.
 *        Ici, la soumission est simulée (2 secondes de chargement).
 */

import { useState } from 'react';
import Button from './Button';

const SERVICES = [
  'Site Vitrine',
  'Site Sur Mesure',
  'Site E-Commerce',
  'Identité Visuelle',
  'Autre',
];

const BUDGETS = [
  'Moins de 1 000 €',
  '1 000 – 3 000 €',
  '3 000 – 8 000 €',
  '8 000 € et plus',
  'À définir',
];

const INITIAL = {
  firstName: '', lastName: '', email: '',
  phone: '', service: '', budget: '', message: '',
};

export default function ContactForm() {
  const [form,    setForm]    = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [status,  setStatus]  = useState(null); // 'success' | 'error' | null
  const [errors,  setErrors]  = useState({});

  /* ── Validation */
  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Champ requis';
    if (!form.lastName.trim())  e.lastName  = 'Champ requis';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Email invalide';
    if (!form.service) e.service = 'Champ requis';
    if (!form.message.trim() || form.message.length < 20)
      e.message = 'Message trop court (min. 20 caractères)';
    return e;
  }

  /* ── Changement de champ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  /* ── Soumission */
  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }

    setLoading(true);
    setStatus(null);
    try {
      // Simulation d'envoi — remplacer par un fetch() réel
      await new Promise((res) => setTimeout(res, 2000));
      setStatus('success');
      setForm(INITIAL);
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = (name) =>
    `w-full bg-white/4 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none
     transition-all duration-300 focus:bg-white/6
     ${errors[name]
       ? 'border-red-500/50 focus:border-red-400'
       : 'border-white/10 focus:border-violet-500/60'
     }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* Prénom + Nom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: 'firstName', placeholder: 'Prénom *' },
          { name: 'lastName',  placeholder: 'Nom *'    },
        ].map(({ name, placeholder }) => (
          <div key={name}>
            <input
              type="text" name={name}
              value={form[name]} onChange={handleChange}
              placeholder={placeholder}
              className={fieldClass(name)}
              aria-invalid={!!errors[name]}
            />
            {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]}</p>}
          </div>
        ))}
      </div>

      {/* Email + Téléphone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            type="email" name="email"
            value={form.email} onChange={handleChange}
            placeholder="Email *"
            className={fieldClass('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>
        <input
          type="tel" name="phone"
          value={form.phone} onChange={handleChange}
          placeholder="Téléphone (optionnel)"
          className={fieldClass('phone')}
        />
      </div>

      {/* Service + Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <select name="service" value={form.service} onChange={handleChange} className={`${fieldClass('service')} cursor-pointer`} aria-invalid={!!errors.service}>
            <option value="" disabled>Service souhaité *</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.service && <p className="mt-1 text-xs text-red-400">{errors.service}</p>}
        </div>
        <select name="budget" value={form.budget} onChange={handleChange} className={`${fieldClass('budget')} cursor-pointer`}>
          <option value="" disabled>Budget estimatif</option>
          {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Message */}
      <div>
        <textarea
          name="message" rows={5}
          value={form.message} onChange={handleChange}
          placeholder="Décrivez votre projet… *"
          className={`${fieldClass('message')} resize-none`}
          aria-invalid={!!errors.message}
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full sm:w-auto self-start"
      >
        Envoyer le message
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>

      {/* Feedback */}
      {status === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2" role="alert">
          <span>✓</span> Message envoyé ! Nous vous répondrons sous 24h.
        </div>
      )}
      {status === 'error' && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2" role="alert">
          <span>✕</span> Une erreur est survenue. Veuillez réessayer.
        </div>
      )}
    </form>
  );
}
