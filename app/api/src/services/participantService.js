import prisma from "../config/prisma.js";

class ParticipantService {
  async createParticipant(participant) {
    return await prisma.participant.create({ data: participant });
  }

  async getParticipants(search) {
    const where = search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
    return await prisma.participant.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });
  }

  async updateParticipant(participantId, data) {
    return await prisma.participant.update({
      where: { id: participantId },
      data,
    });
  }
}

export default new ParticipantService();
