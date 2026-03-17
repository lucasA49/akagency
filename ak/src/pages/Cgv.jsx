/**
 * @page Cgv
 * @route /mentions-legales
 * @description Page des mentions legales et conditions generales de vente.
 *   Contenu indicatif — a adapter avec les informations juridiques reelles.
 */

import AnimatedSection from '../components/AnimatedSection';

const SECTIONS = [
  {
    title: '1. Mentions legales',
    content: `
AK Agency — Agence de creation web
Forme juridique : SASU
Capital social : 5 000 €
Siege social : 75001 Paris, France
SIRET : 000 000 000 00000
Directeur de publication : Nom du dirigeant
Contact : contact@akagency.fr
Telephone : +33 1 23 45 67 89

Hebergeur : Vercel Inc. — 340 Pine Street, Suite 1300, San Francisco, CA 94104, USA
    `.trim(),
  },
  {
    title: '2. Propriete intellectuelle',
    content: `L'ensemble des contenus presents sur le site akagency.fr (textes, images, logos, graphismes, videos) sont proteges par le droit de la propriete intellectuelle et sont la propriete exclusive de AK Agency ou de ses partenaires.

Toute reproduction, distribution, modification ou utilisation sans autorisation ecrite prealable est strictement interdite.`,
  },
  {
    title: '3. Protection des donnees personnelles (RGPD)',
    content: `Conformement au Reglement General sur la Protection des Donnees (RGPD), vous disposez des droits suivants :
• Droit d'acces a vos donnees
• Droit de rectification
• Droit a l'effacement (droit a l'oubli)
• Droit a la limitation du traitement
• Droit a la portabilite
• Droit d'opposition

Pour exercer ces droits, contactez : contact@akagency.fr

Les donnees collectees via le formulaire de contact sont utilisees uniquement pour repondre a vos demandes et ne sont jamais cedees a des tiers.`,
  },
  {
    title: '4. Cookies',
    content: `Le site akagency.fr peut utiliser des cookies techniques necessaires au bon fonctionnement du site. Aucun cookie publicitaire ou de suivi tiers n'est depose sans votre consentement explicite.

Vous pouvez parametrer votre navigateur pour refuser les cookies.`,
  },
  {
    title: '5. Conditions Generales de Vente',
    content: `Les presentes CGV regissent les relations contractuelles entre AK Agency et ses clients.

5.1 Devis et commande
Tout projet debute par un devis detaille, valable 30 jours. La commande est confirmee par la signature du devis et le versement d'un acompte de 40 % du montant total.

5.2 Delais
Les delais indiques dans le devis sont donnes a titre indicatif et courent a partir de la reception de l'acompte et de la fourniture de tous les elements necessaires par le client.

5.3 Propriete des livrables
Les droits d'auteur sur les livrables sont cedes au client apres reglement integral de la prestation.

5.4 Responsabilite
AK Agency est soumise a une obligation de moyens. Sa responsabilite ne saurait etre engagee pour les dommages indirects ou le manque a gagner du client.

5.5 Litiges
En cas de litige, les parties s'engagent a rechercher une solution amiable. A defaut, le tribunal competent est celui du siege social d'AK Agency.`,
  },
  {
    title: '6. Droit applicable',
    content: `Le present site et les CGV sont soumis au droit francais. Toute difficulte relative a leur interpretation ou execution releve de la competence exclusive des tribunaux francais.`,
  },
];

export default function Cgv() {
  return (
    <>
      {/* ═════════════ Hero page ════════════ */}
      <section className="pt-36 pb-16 px-6 text-center mesh-bg relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] rounded-full opacity-8 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #7c3aed, transparent 70%)' }}
        />
        <AnimatedSection className="relative z-10">
          <span className="text-xs font-semibold tracking-[0.25em] text-violet-400 uppercase mb-4 block">
            Juridique
          </span>
          <h1
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Mentions legales & CGV
          </h1>
          <p className="text-white/40 text-sm">
            Derniere mise a jour : mars 2026
          </p>
        </AnimatedSection>
      </section>

      {/* ═════════════ Contenu ════════════ */}
      <section className="section-padding max-w-3xl mx-auto px-6">
        <div className="flex flex-col gap-8">
          {SECTIONS.map((section, i) => (
            <AnimatedSection key={section.title} delay={i * 60}>
              <div className="glass rounded-2xl p-8">
                <h2
                  className="text-xl font-bold text-white mb-4 gradient-text"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {section.title}
                </h2>
                <div className="text-white/50 text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Contact RGPD */}
        <AnimatedSection delay={400} className="mt-8">
          <div className="glass rounded-2xl p-6 flex items-center gap-4 border border-violet-500/15">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-400 flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Exercer vos droits RGPD</p>
              <p className="text-white/40 text-xs mt-0.5">
                Contactez-nous a{' '}
                <a href="mailto:rgpd@akagency.fr" className="text-violet-400 hover:text-violet-300 transition-colors">
                  rgpd@akagency.fr
                </a>
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
