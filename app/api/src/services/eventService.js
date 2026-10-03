import prisma from "../config/prisma.js";
import registrationService from "./registrationService.js";

class EventService {
  async createEvent(event) {
    return await prisma.event.create({ data: event });
  }

  async getAllEvents({ status, date } = {}) {
    const where = {};

    if (status) where.status = status;
    if (date) {
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setUTCDate(end.getUTCDate() + 1);

      where.eventDate = {
        gte: start,
        lt: end,
      };
    }
    return await prisma.event.findMany({
      where,
      orderBy: { eventDate: "asc" },
    });
  }

  async getOneEvent(eventId) {
    return await prisma.event.findUnique({
      where: { id: eventId },
    });
  }

  async updateEvent(eventId, data) {
    return await prisma.event.update({
      where: { id: eventId },
      data,
    });
  }

  async updateEventStatus(eventId, status) {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: { status },
    });

    if (status === "cancelled") {
      await registrationService.cancelAllByEventId(eventId);
    }
    return event;
  }
}

export default new EventService();
