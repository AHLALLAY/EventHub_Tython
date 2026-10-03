# Sujet : EventHub — Gestion d’Événements & Inscriptions

## 1) Objectif

Développer une application web (**PERN Stack** : PostgreSQL, Express, React, Node.js) permettant de gérer :

- [x] des événements (création et publication)
- [ ] des participants
- [ ] des inscriptions
- [ ] un dashboard simple (statistiques)

## 2) Livrables attendus

Merci de fournir :

- [x] **Conception** (obligatoire)
  - [x] Schéma DB (ERD) ou document de conception
  - [x] Tables + relations (PK/FK)
  - [x] Contraintes importantes et index recommandés.
- [x] **Backend**
  - [x] API REST Node.js + Express
  - [x] Validation des entrées
  - [x] Authentication JWT.
- [ ] **Frontend**
  - [x] React (Vite recommandé)
  - [ ] Interface fonctionnelle (liste / détails / création).
- [x] **PostgreSQL**
  - [x] Script SQL ou migrations.
- [x] **README**
  - [x] Installation + variables d’environnement + commandes

## 3) Contraintes techniques

### Backend (obligatoire)

- [x] Node.js + Express
- [x] JWT + bcrypt
- [x] Validation : Zod / Joi / express-validator
- [x] Gestion d’erreurs claire (400 / 401 / 403 / 404 / 500)

### Base de données (obligatoire)

- [x] PostgreSQL
- [x] UUID recommandés
- [x] Contraintes : UNIQUE / NOT NULL / CHECK
- [x] Index pour la recherche et performance

### Frontend (obligatoire)

- [x] React + Vite
- [ ] Consommation API REST
- [ ] UI simple et propre (Tailwind optionnel)

## 4) Fonctionnalités demandées

### 4.1 Authentication & rôles

- [ ] Rôles :
  - [ ] `admin` : gestion complète (événements + utilisateurs)
  - [ ] `staff` : gestion des événements + inscriptions
- [x] Endpoints minimum :
  - [x] `POST: /api/auth/login`
  - [x] `GET: /api/auth/me`

### 4.2 Gestion des Événements

- [x] Champs minimum :
  - [x] `title`
  - [x] `description`
  - [x] `location`
  - [x] `eventDate` (date + heure)
  - [x] `maxParticipants`
  - [x] `status` : `draft` , `published` , `cancelled`
  - [x] `createdBy`
- [x] Fonctions :
  - [x] Créer événement
  - [x] Modifier événement
  - [x] Publier (passer `draft` → `published` )
  - [x] Liste des événements + Filtre par statut
  - [x] Détail d’un événement

> ✅ **Règle métier obligatoire :**
> Impossible d’inscrire un participant sur un événement non publié.

### 4.3 Gestion des Participants

**Champs minimum :**

- [x] `fullName`
- [x] `email` (unique)
- [x] `phone` (optionnel)
- [x] `createdAt`

**Fonctions :**

- [x] CRUD participants
- [x] Recherche par `fullName` ou `email`

### 4.4 Gestion des Inscriptions

Un participant peut s’inscrire à plusieurs événements (relation N-N).

**Champs minimum :**

- [x] `eventId`
- [x] `participantId`
- [x] `status` : `pending`, `confirmed`, `cancelled`
- [x] `createdAt`

> ✅ **Règles métier obligatoires :**
>
> - [ ] Un participant ne peut pas s’inscrire 2 fois au même événement
> - [ ] Ne pas dépasser `maxParticipants` (si complet → bloquer inscription)
> - [ ] Quand un événement est `cancelled`, toutes les inscriptions passent en `cancelled`

## 5) Dashboard (obligatoire)

Acher au minimum :

- [ ] nombre total d’événements
- [ ] nombre d’événements publiés
- [ ] inscriptions du jour
- [ ] top 5 événements les plus remplis

## 6) Conception Base de Données (obligatoire)

Le candidat doit livrer un ERD + tables minimales recommandées :

- [x] `users`
- [x] `events`
- [x] `participants`
- [x] `registrations`

**Contraintes attendues :**

- [x] `participants.email` UNIQUE
- [x] `registrations (event_id, participant_id)` UNIQUE
- [x] FK cohérentes + index utiles

## 7) API REST minimale attendue

### Events

- [x] `POST /api/events`
- [x] `GET /api/events?status=&date=`
- [x] `GET /api/events/:id`
- [x] `PUT /api/events/:id`
- [x] `PATCH /api/events/:id/status`

### Participants

- [x] `POST /api/participants`
- [x] `GET /api/participants?search=`
- [x] `PUT /api/participants/:id`

### Registrations

- [ ] `POST /api/registrations`
- [ ] `GET /api/registrations?eventId=&status=`
- [ ] `PATCH /api/registrations/:id/status`

## 8) Frontend React (obligatoire)

Pages minimum :

- [ ] Login
- [ ] Dashboard
- [ ] Liste événements + ltres
- [ ] Détails événement (avec liste inscriptions)
- [ ] Page participants
- [ ] Form inscription participant → événement

## 9) Données de test (seed)

Inclure :

- [x] 1 admin + 1 staff
- [x] 5 événements (draft/published/cancelled)
- [x] 10 participants
- [x] 20 inscriptions (différents statuts)

## 10) Bonus (facultatif)

- [ ] Docker compose (frontend + backend + postgres)
- [ ] Swagger/OpenAPI
- [ ] Tests backend (Jest/Supertest)
- [ ] Pagination sur inscriptions + événements
