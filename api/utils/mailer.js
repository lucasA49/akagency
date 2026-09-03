'use strict';

/**
 * @module utils/mailer
 * @description Envoi d'e-mails transactionnels via Nodemailer + Gmail SMTP.
 */

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.MAIL_HOST   || 'smtp.gmail.com',
  port:   parseInt(process.env.MAIL_PORT || '587', 10),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Envoie l'email de réinitialisation de mot de passe.
 * @param {string} to        Adresse destinataire
 * @param {string} token     Token brut (non hashé) à inclure dans le lien
 */
async function sendPasswordResetEmail(to, token) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/reset-password?token=${token}`;
  const expiresMin = process.env.RESET_TOKEN_EXPIRES_MINUTES || 60;

  await transporter.sendMail({
    from:    process.env.MAIL_FROM || `"AK Agency" <${process.env.MAIL_USER}>`,
    to,
    subject: '🔐 Réinitialisation de votre mot de passe — AK Agency',
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0f0f0f; color: #e5e5e5; margin: 0; padding: 0; }
          .container { max-width: 520px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
          .header { background: linear-gradient(135deg, #7c3aed, #06b6d4); padding: 32px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; color: #fff; letter-spacing: -0.5px; }
          .body { padding: 32px; }
          .body p { color: rgba(255,255,255,0.65); line-height: 1.6; margin: 0 0 16px; font-size: 14px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #7c3aed, #06b6d4); color: #fff !important; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: 600; font-size: 14px; margin: 8px 0 24px; }
          .url { font-size: 11px; color: rgba(255,255,255,0.3); word-break: break-all; }
          .footer { padding: 20px 32px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: rgba(255,255,255,0.25); text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Réinitialisation du mot de passe</h1>
          </div>
          <div class="body">
            <p>Bonjour,</p>
            <p>Une demande de réinitialisation de mot de passe a été effectuée pour votre compte administrateur <strong>AK Agency</strong>.</p>
            <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
            <a href="${resetUrl}" class="btn">Réinitialiser mon mot de passe</a>
            <p>Ce lien est valable <strong>${expiresMin} minutes</strong>. Passé ce délai, vous devrez faire une nouvelle demande.</p>
            <p>Si vous n'avez pas fait cette demande, ignorez cet e-mail — votre compte est en sécurité.</p>
            <p class="url">${resetUrl}</p>
          </div>
          <div class="footer">
            AK Agency · Administration interne · Ne pas répondre à cet e-mail
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

module.exports = { sendPasswordResetEmail };
