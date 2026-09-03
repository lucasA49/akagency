# AK Agency — API REST (Node.js + MySQL)

Backend MVC sécurisé pour la gestion des projets du site AK Agency.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Serveur | Node.js 18+ · Express 4 |
| Base de données | MySQL 8+ via `mysql2` (pool de connexions) |
| Authentification | JWT (jsonwebtoken) |
| Hachage mot de passe | bcryptjs · sel automatique · coût 12 |
| Validation | express-validator |
| Sécurité HTTP | Helmet · CORS · Rate Limiting |
| Emails | Nodemailer + Gmail SMTP |

---

## Structure MVC

```
api/
├── app.js                    # Point d'entrée — Express, middlewares, routes
├── config/
│   └── db.js                 # Pool MySQL2
├── controllers/
│   ├── authController.js     # login, me, forgotPassword, resetPassword
│   └── projectController.js  # CRUD projets
├── middleware/
│   ├── auth.js               # requireAuth (JWT) · requireAdmin
│   └── validate.js           # Intercepteur express-validator
├── models/
│   ├── User.js               # Requêtes SQL table users
│   └── Project.js            # Requêtes SQL table projects
├── routes/
│   ├── auth.js               # Routes /api/auth/*
│   └── projects.js           # Routes /api/projects/*
├── utils/
│   └── mailer.js             # Envoi d'email (reset mot de passe)
├── scripts/
│   └── seed.js               # Initialisation BDD + compte admin
├── database/
│   └── schema.sql            # Schéma SQL complet
└── .env.example              # Variables d'environnement à copier
```

---

## Installation

### 1. Pré-requis

- Node.js ≥ 18
- MySQL 8+
- Un compte Gmail avec [Mot de passe d'application](https://myaccount.google.com/apppasswords) activé

### 2. Base de données

```sql
-- Dans votre client MySQL :
SOURCE /chemin/vers/api/database/schema.sql;
```

### 3. Variables d'environnement

```bash
cd api
cp .env.example .env
# Éditez .env avec vos valeurs
```

Générer un secret JWT fort :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Dépendances

```bash
cd api
npm install
```

### 5. Seed (compte admin + projets de démo)

```bash
npm run seed
```

Cela crée :
- **Admin** : `lucasaksu@gmail.com` / `Admin@2026!`
- Les 8 projets de démonstration

> **Changez le mot de passe après la première connexion !**

### 6. Démarrage

```bash
# Développement (rechargement automatique)
npm run dev

# Production
npm start
```

L'API écoute sur `http://localhost:4000`

---

## Référence API

### Base URL : `http://localhost:4000/api`

---

### Authentification

#### `POST /auth/login`

Connexion administrateur.

**Body**
```json
{
  "email": "lucasaksu@gmail.com",
  "password": "Admin@2026!"
}
```

**Réponse 200**
```json
{
  "token": "eyJhbGci...",
  "user": { "id": 1, "email": "lucasaksu@gmail.com", "role": "admin" }
}
```

**Erreurs**
| Code | Message |
|------|---------|
| 401 | Email ou mot de passe incorrect |
| 422 | Données invalides |
| 429 | Trop de tentatives (10 / 15 min) |

---

#### `GET /auth/me`

Retourne le profil de l'admin connecté.

**Header requis** : `Authorization: Bearer <token>`

**Réponse 200**
```json
{
  "user": { "id": 1, "email": "lucasaksu@gmail.com", "role": "admin" }
}
```

---

#### `POST /auth/forgot-password`

Demande de réinitialisation. Un email est envoyé à `lucasaksu@gmail.com`.

> La réponse est identique que l'email existe ou non (sécurité anti-enumération).

**Body**
```json
{ "email": "lucasaksu@gmail.com" }
```

**Réponse 200**
```json
{
  "message": "Si un compte existe pour ..., un e-mail de réinitialisation a été envoyé."
}
```

**Limite** : 5 demandes / 15 min par IP.

---

#### `POST /auth/reset-password`

Définit un nouveau mot de passe via le token reçu par email.

**Body**
```json
{
  "token": "abc123...",
  "password": "NouveauMotDePasse@2026!"
}
```

Règles mot de passe :
- Minimum 8 caractères
- Au moins 1 majuscule
- Au moins 1 chiffre
- Au moins 1 caractère spécial

**Réponse 200**
```json
{ "message": "Mot de passe réinitialisé avec succès." }
```

---

### Projets

#### `GET /projects`

Liste des projets visibles (public).

**Query params optionnels**
| Paramètre | Valeurs | Description |
|---|---|---|
| `category` | `Site Vitrine` · `Site E-Commerce` · `Site Sur Mesure` · `Identite Visuelle` | Filtre par catégorie |
| `visible` | `all` | (Admin uniquement) Inclut les projets masqués |

**Réponse 200**
```json
{
  "projects": [
    {
      "id": 1,
      "title": "Maison Leclair",
      "category": "Site E-Commerce",
      "tags": ["React", "Stripe", "Tailwind", "Sanity"],
      "gradient": "from-violet-600 via-purple-500 to-pink-500",
      "href": "#",
      "is_visible": true,
      "sort_order": 1,
      "created_at": "2026-03-17T10:00:00.000Z"
    }
  ],
  "total": 8
}
```

---

#### `GET /projects/:id`

Détail d'un projet (public).

**Réponse 200** : objet `project` complet.
**404** si introuvable.

---

#### `POST /projects` — *Admin*

Crée un nouveau projet.

**Header** : `Authorization: Bearer <token>`

**Body**
```json
{
  "title": "Mon Projet",
  "category": "Site Vitrine",
  "tags": ["React", "Tailwind"],
  "gradient": "from-violet-600 to-cyan-500",
  "href": "https://monprojet.fr",
  "is_visible": true,
  "sort_order": 9
}
```

**Réponse 201**
```json
{ "message": "Projet créé.", "project": { ... } }
```

---

#### `PATCH /projects/:id` — *Admin*

Met à jour un projet (partiel : seuls les champs fournis sont modifiés).

**Header** : `Authorization: Bearer <token>`

**Body** : mêmes champs que POST (tous optionnels)

```json
{ "title": "Nouveau titre", "is_visible": false }
```

**Réponse 200**
```json
{ "message": "Projet mis à jour.", "project": { ... } }
```

---

#### `DELETE /projects/:id` — *Admin*

Supprime un projet.

**Header** : `Authorization: Bearer <token>`

**Réponse 200**
```json
{ "message": "Projet supprimé." }
```

---

#### `PATCH /projects/:id/visibility` — *Admin*

Toggle rapide de visibilité (sans envoyer tout le body).

**Header** : `Authorization: Bearer <token>`

**Body** (optionnel — si absent, inverse la valeur actuelle)
```json
{ "is_visible": false }
```

**Réponse 200**
```json
{ "message": "Projet masqué.", "project": { ... } }
```

---

## Sécurité

| Mesure | Détail |
|---|---|
| **Hachage mot de passe** | bcryptjs · sel aléatoire intégré · coût 12 (~250ms) |
| **Token reset hashé** | Le token brut est en SHA-256 avant stockage BDD. Une fuite DB ne permet pas de réinitialiser le mot de passe. |
| **JWT signé** | Secret 64 octets minimum · expiration 24h |
| **Rate limiting** | Global (100/15min) · Login (10/15min) · Forgot (5/15min) |
| **Helmet** | En-têtes CSP, X-Frame-Options, HSTS… |
| **CORS strict** | Seul le frontend configuré est autorisé |
| **Validation** | express-validator sur tous les inputs |
| **Timing attack** | Login utilise un faux hash si l'email n'existe pas |
| **Body size limit** | 10 kb max |

---

## Variables d'environnement

| Variable | Exemple | Description |
|---|---|---|
| `PORT` | `4000` | Port du serveur |
| `FRONTEND_URL` | `http://localhost:5173` | URL autorisée par CORS |
| `DB_HOST` | `localhost` | Hôte MySQL |
| `DB_PORT` | `3306` | Port MySQL |
| `DB_USER` | `root` | Utilisateur MySQL |
| `DB_PASSWORD` | `secret` | Mot de passe MySQL |
| `DB_NAME` | `ak_agency` | Nom de la base |
| `JWT_SECRET` | `hex64bytes` | Secret JWT (généré avec crypto) |
| `JWT_EXPIRES_IN` | `24h` | Durée du token |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP host |
| `MAIL_PORT` | `587` | SMTP port |
| `MAIL_USER` | `lucasaksu@gmail.com` | Compte expéditeur |
| `MAIL_PASS` | `app_password` | App password Gmail |
| `RESET_TOKEN_EXPIRES_MINUTES` | `60` | Durée de validité du token reset |

---

## Flux "Mot de passe oublié"

```
Admin         API                   MySQL              Gmail
  │                                    │                  │
  │──POST /auth/forgot-password────────►                  │
  │           │                        │                  │
  │           │──SELECT user by email──►                  │
  │           │◄──user found───────────│                  │
  │           │                        │                  │
  │           │  crypto.randomBytes(32) = rawToken        │
  │           │  sha256(rawToken)       = tokenHash       │
  │           │──UPDATE reset_token_hash, expires─────────►
  │           │                        │                  │
  │           │──sendMail(rawToken)─────────────────────────►
  │           │                        │                  │
  │◄──200 (message générique)──────────│                  │
  │                                    │                  │
  │◄──────────────────email avec lien──────────────────────
  │                                    │                  │
  │──POST /auth/reset-password─────────►                  │
  │      { token: rawToken, password } │                  │
  │           │  sha256(rawToken) = tokenHash             │
  │           │──SELECT WHERE token_hash = ? AND expires > NOW()
  │           │◄──user found───────────│                  │
  │           │  bcrypt.hash(password) = newHash          │
  │           │──UPDATE password_hash, clear token────────►
  │◄──200 succès───────────────────────│                  │
```

---

## Intégration front-end

Pour connecter le front React aux projets depuis la BDD, remplacez dans `Realisations.jsx` :

```jsx
// Avant (données statiques)
const PROJECTS = [ ... ];

// Après (depuis l'API)
const [projects, setProjects] = useState([]);
useEffect(() => {
  fetch('http://localhost:4000/api/projects')
    .then(r => r.json())
    .then(data => setProjects(data.projects));
}, []);
```
