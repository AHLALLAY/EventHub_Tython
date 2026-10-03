import bcrypt from "bcrypt";
import prisma from "../src/config/prisma.js";

// 1 jour en millisecondes
const DAY = 24 * 60 * 60 * 1000;

// Date dans N jours (pour les événements futurs)
function inDays(n) {
  return new Date(Date.now() + n * DAY);
}

// Date il y a N jours (pour les inscriptions)
function daysAgo(n) {
  return new Date(Date.now() - n * DAY);
}

const USERS = [
  {
    email: "admin@eventhub.com",
    password: "Admin123!",
    fullName: "Admin EventHub",
    role: "admin",
  },
  {
    email: "staff@eventhub.com",
    password: "Staff123!",
    fullName: "Staff EventHub",
    role: "staff",
  },
];

const EVENTS = [
  {
    key: "react",
    title: "Conférence React 2026",
    description: "Une journée de talks sur React, les Server Components et l'écosystème.",
    location: "Casablanca - Technopark",
    eventDate: inDays(14),
    maxParticipants: 50,
    status: "published",
    by: "admin",
  },
  {
    key: "pg",
    title: "Atelier PostgreSQL avancé",
    description: "Index, transactions, verrous et optimisation de requêtes.",
    location: "Rabat - Salle B2",
    eventDate: inDays(7),
    maxParticipants: 5,
    status: "published",
    by: "staff",
  },
  {
    key: "node",
    title: "Meetup Node.js",
    description: "Retours d'expérience sur Node.js en production.",
    location: "Marrakech - Coworking Gueliz",
    eventDate: inDays(21),
    maxParticipants: 20,
    status: "published",
    by: "staff",
  },
  {
    key: "hack",
    title: "Hackathon PERN",
    description: "48h pour construire une application PERN complète.",
    location: "Tanger - Campus Numérique",
    eventDate: inDays(45),
    maxParticipants: 100,
    status: "draft",
    by: "admin",
  },
  {
    key: "docker",
    title: "Webinaire Docker & CI/CD",
    description: "Conteneurisation et pipelines (annulé).",
    location: "En ligne",
    eventDate: inDays(10),
    maxParticipants: 30,
    status: "cancelled",
    by: "admin",
  },
];

const PARTICIPANTS = [
  { fullName: "Yassine El Amrani", email: "yassine.elamrani@example.com", phone: "+212 600 000 001" },
  { fullName: "Salma Benali", email: "salma.benali@example.com", phone: "+212 600 000 002" },
  { fullName: "Omar Chraibi", email: "omar.chraibi@example.com", phone: null },
  { fullName: "Fatima Zahra Idrissi", email: "fatima.idrissi@example.com", phone: "+212 600 000 004" },
  { fullName: "Mehdi Tazi", email: "mehdi.tazi@example.com", phone: "+212 600 000 005" },
  { fullName: "Imane Berrada", email: "imane.berrada@example.com", phone: null },
  { fullName: "Karim Lahlou", email: "karim.lahlou@example.com", phone: "+212 600 000 007" },
  { fullName: "Nadia Fassi", email: "nadia.fassi@example.com", phone: "+212 600 000 008" },
  { fullName: "Hamza Alaoui", email: "hamza.alaoui@example.com", phone: null },
  { fullName: "Sara Mansouri", email: "sara.mansouri@example.com", phone: "+212 600 000 010" },
];

// Chaque ligne = [clé événement, index participant, statut, créée il y a N jours]
const REGISTRATIONS = [
  ["react", 0, "confirmed", 0],
  ["react", 1, "confirmed", 0],
  ["react", 2, "pending", 0],
  ["react", 3, "confirmed", 2],
  ["react", 4, "pending", 3],
  ["react", 5, "cancelled", 4],
  ["react", 6, "confirmed", 1],
  ["pg", 0, "confirmed", 5],
  ["pg", 1, "confirmed", 5],
  ["pg", 2, "pending", 4],
  ["pg", 3, "confirmed", 3],
  ["pg", 4, "pending", 0],
  ["pg", 7, "cancelled", 2],
  ["node", 5, "confirmed", 6],
  ["node", 6, "pending", 0],
  ["node", 7, "confirmed", 1],
  ["node", 8, "pending", 2],
  ["node", 9, "cancelled", 3],
  ["docker", 1, "cancelled", 8],
  ["docker", 8, "cancelled", 7],
];

async function seed() {
  try {
    // Option : node prisma/seed.js --if-empty
    // Si la base a déjà des users, on ne fait rien
    const onlyIfEmpty = process.argv.includes("--if-empty");
    if (onlyIfEmpty) {
      const userCount = await prisma.user.count();
      if (userCount > 0) {
        console.log("Base déjà initialisée : seed ignoré.");
        return;
      }
    }

    // Étape 1 : vider les tables (ordre important à cause des clés étrangères)
    await prisma.registration.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();

    // Étape 2 : créer les utilisateurs (mot de passe hashé)
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const userIds = {};

    for (let i = 0; i < USERS.length; i++) {
      const u = USERS[i];
      const passwordHash = await bcrypt.hash(u.password, rounds);

      const created = await prisma.user.create({
        data: {
          email: u.email,
          passwordHash: passwordHash,
          fullName: u.fullName,
          role: u.role,
        },
      });

      // Exemple : userIds["admin"] = "uuid-..."
      userIds[u.role] = created.id;
    }

    // Étape 3 : créer les événements
    const eventIds = {};

    for (let i = 0; i < EVENTS.length; i++) {
      const e = EVENTS[i];

      const created = await prisma.event.create({
        data: {
          title: e.title,
          description: e.description,
          location: e.location,
          eventDate: e.eventDate,
          maxParticipants: e.maxParticipants,
          status: e.status,
          createdBy: userIds[e.by],
        },
      });

      // Exemple : eventIds["react"] = "uuid-..."
      eventIds[e.key] = created.id;
    }

    // Étape 4 : créer les participants
    const participantIds = [];

    for (let i = 0; i < PARTICIPANTS.length; i++) {
      const p = PARTICIPANTS[i];

      const created = await prisma.participant.create({
        data: {
          fullName: p.fullName,
          email: p.email,
          phone: p.phone,
        },
      });

      participantIds.push(created.id);
    }

    // Étape 5 : créer les inscriptions
    for (let i = 0; i < REGISTRATIONS.length; i++) {
      const eventKey = REGISTRATIONS[i][0];
      const pIndex = REGISTRATIONS[i][1];
      const status = REGISTRATIONS[i][2];
      const ago = REGISTRATIONS[i][3];

      await prisma.registration.create({
        data: {
          eventId: eventIds[eventKey],
          participantId: participantIds[pIndex],
          status: status,
          createdAt: daysAgo(ago),
        },
      });
    }

    console.log("Seed terminé avec succès.");
    console.log("Utilisateurs :", USERS.length);
    console.log("Événements :", EVENTS.length);
    console.log("Participants :", PARTICIPANTS.length);
    console.log("Inscriptions :", REGISTRATIONS.length);
    console.log("");
    console.log("Comptes de test :");
    for (let i = 0; i < USERS.length; i++) {
      const u = USERS[i];
      console.log("-", u.role, ":", u.email, "/", u.password);
    }
  } catch (error) {
    console.error("Seed échoué :", error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
