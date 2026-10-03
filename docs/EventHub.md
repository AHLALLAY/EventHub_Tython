# Sujet : EventHub — Gestion d’Événements & Inscriptions

## 1) Objectif

Développer une application web (**PERN Stack** : PostgreSQL, Express, React, Node.js) permettant de gérer :

- des événements (création et publication)
- des participants
- des inscriptions
- un dashboard simple (statistiques)

## 2) Livrables attendus

Merci de fournir :

- [ ] **Conception** (obligatoire)
  - [ ] Schéma DB (ERD) ou document de conception
  - [ ] Tables + relations (PK/FK)
  - [ ] Contraintes importantes et index recommandés.
- [ ] **Backend**
  - [ ] API REST Node.js + Express
  - [ ] Validation des entrées
  - [ ] Authentication JWT.
- [ ] **Frontend**
  - [ ] React (Vite recommandé)
  - [ ] Interface fonctionnelle (liste / détails / création).
- [ ] **PostgreSQL**
  - [ ] Script SQL ou migrations.
- [ ] **README**
  - [ ] Installation + variables d’environnement + commandes

## 3) Contraintes techniques

### Backend (obligatoire)

- [ ] Node.js + Express
- [ ] JWT + bcrypt
- [ ] Validation : Zod / Joi / express-validator
- [ ] Gestion d’erreurs claire (400 / 401 / 403 / 404 / 500)

### Base de données (obligatoire)

- [ ] PostgreSQL
- [ ] UUID recommandés
- [ ] Contraintes : UNIQUE / NOT NULL / CHECK
- [ ] Index pour la recherche et performance

### Frontend (obligatoire)

- [ ] React + Vite
- [ ] Consommation API REST
- [ ] UI simple et propre (Tailwind optionnel)

## 4) Fonctionnalités demandées

### 4.1 Authentication & rôles

- Rôles :
  - `admin` : gestion complète (événements + utilisateurs)
  - `staff` : gestion des événements + inscriptions
- Endpoints minimum :
  - `POST: /api/auth/login`
  - `GET: /api/auth/me`

### 4.2 Gestion des Événements

- [ ] Champs minimum :
  - [ ] `title`
  - [ ] `description`
  - [ ] `location`
  - [ ] `eventDate` (date + heure)
  - [ ] `maxParticipants`
  - [ ] `status` : `draft` , `published` , `cancelled`
  - [ ] `createdBy`
- [ ] Fonctions :
  - [ ] Créer événement
  - [ ] Modier événement
  - [ ] Publier (passer `draft` → `published` )
  - [ ] Liste des événements + ltre par statut
  - [ ] Détail d’un événement

> ✅ **Règle métier obligatoire :**
> Impossible d’inscrire un participant sur un événement non publié.

### 4.3 Gestion des Participants

**Champs minimum :**

- `fullName`
- `email` (unique)
- `phone` (optionnel)
- `createdAt`

**Fonctions :**

- CRUD participants
- Recherche par `fullName` ou `email`

### 4.4 Gestion des Inscriptions

Un participant peut s’inscrire à plusieurs événements (relation N-N).

**Champs minimum :**

- `eventId`
- `participantId`
- `status` : `pending`, `confirmed`, `cancelled`
- `createdAt`

> ✅ **Règles métier obligatoires :**
>
> - Un participant ne peut pas s’inscrire 2 fois au même événement
> - Ne pas dépasser `maxParticipants` (si complet → bloquer inscription)
> - Quand un événement est `cancelled`, toutes les inscriptions passent en `cancelled`

## 5) Dashboard (obligatoire)

Acher au minimum :

- nombre total d’événements
- nombre d’événements publiés
- inscriptions du jour
- top 5 événements les plus remplis

## 6) Conception Base de Données (obligatoire)

Le candidat doit livrer un ERD + tables minimales recommandées :

- `users`
- `events`
- `participants`
- `registrations`

**Contraintes attendues :**

- `participants.email` UNIQUE
- `registrations (event_id, participant_id)` UNIQUE
- FK cohérentes + index utiles

## 7) API REST minimale attendue

### Events

- `POST /api/events`
- `GET /api/events?status=&date=`
- `GET /api/events/:id`
- `PUT /api/events/:id`
- `PATCH /api/events/:id/status`

### Participants

- `POST /api/participants`
- `GET /api/participants?search=`
- `PUT /api/participants/:id`

### Registrations

- `POST /api/registrations`
- `GET /api/registrations?eventId=&status=`
- `PATCH /api/registrations/:id/status`

## 8) Frontend React (obligatoire)

Pages minimum :

- Login
- Dashboard
- Liste événements + ltres
- Détails événement (avec liste inscriptions)
- Page participants
- Form inscription participant → événement

## 9) Données de test (seed)

Inclure :

- 1 admin + 1 staff
- 5 événements (draft/published/cancelled)
- 10 participants
- 20 inscriptions (différents statuts)

## 10) Bonus (facultatif)

- Docker compose (frontend + backend + postgres)
- Swagger/OpenAPI
- Tests backend (Jest/Supertest)
- Pagination sur inscriptions + événements
