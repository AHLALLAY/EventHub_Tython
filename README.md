# EventHub

Application web de gestion d’événements et d’inscriptions (stack **PERN** : PostgreSQL, Express, React, Node.js).

## Fonctionnalités prévues

- Authentification JWT avec rôles `admin` et `staff`
- Gestion des événements (`draft` / `published` / `cancelled`)
- Gestion des participants
- Inscriptions (relation N-N événement ↔ participant)
- Dashboard (statistiques)

## Structure du projet

```text
.
├── app/
│   ├── api/          # Backend Express + Prisma
│   └── web/          # Frontend React (Vite)
├── docs/             # Cahier des charges + ERD
├── .gitignore
└── README.md
```

## Prérequis

- Node.js (LTS recommandé)
- PostgreSQL
- npm

## Installation

### 1. Cloner le dépôt

#### Cloner en SSH

Recommandé si une clé SSH est déjà configurée sur GitHub (pas de mot de passe à chaque push).

```bash
git clone git@github.com:AHLALLAY/EventHub_Tython.git
cd EventHub_Tython
```

#### Cloner en HTTPS

Plus simple pour démarrer ; l’authentification se fait via un token GitHub.

```bash
git clone https://github.com/AHLALLAY/EventHub_Tython.git
cd EventHub_Tython
```

### 2. Backend (`app/api`)

```bash
cd app/api
npm install
cp .env.example .env
```

Édite ensuite `.env` avec tes valeurs locales (base PostgreSQL, secret JWT, etc.).

Exemple de variables (voir `.env.example`) :

| Variable | Description |
|---|---|
| `PORT` | Port de l’API (ex. `3000`) |
| `DATABASE_URL` | URL de connexion PostgreSQL |
| `JWT_SECRET` | Clé secrète pour les tokens |
| `JWT_EXPIRES_IN` | Durée de validité du token (ex. `15m`) |
| `CORS_ORIGIN` | Origine autorisée (ex. `http://localhost:5173`) |
| `BCRYPT_SALT_ROUNDS` | Nombre de rounds bcrypt |

Puis initialise Prisma et démarre l’API :

```bash
npx prisma generate
npx prisma db push
npm run dev
```

L’API écoute par défaut sur `http://localhost:3000`.

> Pour peupler la base avec des données de test (quand le seed est prêt) :
> `npx prisma db seed`

### 3. Frontend (`app/web`)

Dans un autre terminal :

```bash
cd app/web
npm install
npm run dev
```

Le frontend démarre en général sur `http://localhost:5173`.

## Scripts utiles

### API

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur Express avec rechargement (`node --watch`) |

### Web

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement Vite |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualisation du build |
| `npm run lint` | Vérification ESLint |

## Schéma ERD

Diagramme entité-relation du projet :

![Schéma ERD EventHub](docs/Tython_ERD.png)

## Modèle de données (aperçu)

Tables principales définies dans `app/api/prisma/schema.prisma` :

- `users`
- `events`
- `participants`
- `registrations`

Voir aussi `docs/EventHub.md` (sujet) et le schéma Prisma pour le détail des champs et relations.

## État actuel

Projet en cours de développement : structure initiale (API Express, schéma Prisma, frontend Vite/React) en place. Les endpoints métier et l’UI complète restent à implémenter.

## Auteur

Abderrahmane Ahlallay
