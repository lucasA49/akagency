-- ═══════════════════════════════════════════════════
-- AK Agency — Schéma base de données
-- Encodage : utf8mb4 (support emojis et caractères spéciaux)
-- ═══════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS ak_agency
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ak_agency;

-- ─── Table : users ───────────────────────────────────
-- Stocke les comptes administrateurs.
-- Le mot de passe est hashé avec bcrypt (sel intégré).
-- Le reset_token est stocké hashé (SHA-256) pour éviter
-- qu'un accès en lecture à la DB permette une prise de compte.
CREATE TABLE IF NOT EXISTS users (
  id                   INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  email                VARCHAR(255)    NOT NULL,
  password_hash        VARCHAR(255)    NOT NULL,
  role                 ENUM('admin')   NOT NULL DEFAULT 'admin',
  reset_token_hash     VARCHAR(255)    DEFAULT NULL COMMENT 'SHA-256 du token envoyé par mail',
  reset_token_expires  DATETIME        DEFAULT NULL,
  created_at           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Table : projects ────────────────────────────────
-- Projets affichés dans le composant ProjectCard du front.
-- `tags` est stocké en JSON (tableau de strings).
CREATE TABLE IF NOT EXISTS projects (
  id           INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  title        VARCHAR(255)     NOT NULL,
  category     ENUM(
                 'Site Vitrine',
                 'Site E-Commerce',
                 'Site Sur Mesure',
                 'Identite Visuelle'
               )                NOT NULL,
  tags         JSON             NOT NULL DEFAULT (JSON_ARRAY()),
  gradient     VARCHAR(255)     NOT NULL DEFAULT 'from-violet-600 to-cyan-500',
  href         VARCHAR(500)     NOT NULL DEFAULT '#',
  is_visible   TINYINT(1)       NOT NULL DEFAULT 1 COMMENT '1 = affiché, 0 = masqué',
  sort_order   SMALLINT         NOT NULL DEFAULT 0  COMMENT 'Ordre d''affichage (croissant)',
  created_at   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_projects_category   (category),
  KEY idx_projects_visible    (is_visible),
  KEY idx_projects_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
