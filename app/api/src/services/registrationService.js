import prisma from "../config/prisma.js";

class RegistrationService {
  async createRegistration({ eventId, participantId, status }) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      const error = new Error("Événement introuvable");
      error.statusCode = 404;
      throw error;
    }

    if (event.status !== "published") {
      const error = new Error(
        "Impossible d'inscrire un participant sur un événement non publié",
      );
      error.statusCode = 400;
      throw error;
    }

    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
    });
    if (!participant) {
      const error = new Error("Participant introuvable");
      error.statusCode = 404;
      throw error;
    }

    const existing = await prisma.registration.findUnique({
      where: { eventId_participantId: { eventId, participantId } },
    });
    if (existing) {
      const error = new Error(
        "Ce participant est déjà inscrit à cet événement",
      );
      error.statusCode = 409;
      throw error;
    }

    // pending + confirmed ne doivent pas dépasser maxParticipants
    const activeCount = await prisma.registration.count({
      where: {
        eventId,
        status: { in: ["pending", "confirmed"] },
      },
    });
    if (activeCount >= event.maxParticipants) {
      const error = new Error("Événement complet (nombre maximum atteint)");
      error.statusCode = 400;
      throw error;
    }

    return prisma.registration.create({
      data: { eventId, participantId, status },
    });
  }

  async getRegistrations({ eventId, status } = {}) {
    const where = {};
    if (eventId) where.eventId = eventId;
    if (status) where.status = status;

    return prisma.registration.findMany({
      where,
      orderBy: { createdAt: "asc" },
      include: {
        event: { select: { id: true, title: true, status: true } },
        participant: { select: { id: true, fullName: true, email: true } },
      },
    });
  }

  async updateRegistrationStatus(registrationId, status) {
    return prisma.registration.update({
      where: { id: registrationId },
      data: { status },
    });
  }

  async cancelAllByEventId(eventId) {
    return prisma.registration.updateMany({
      where: { eventId },
      data: { status: "cancelled" },
    });
  }
}

export default new RegistrationService();
