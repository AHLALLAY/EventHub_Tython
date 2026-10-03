import prisma from "../config/prisma.js";
class EventService {
  async createEvent(event) {
    return await prisma.event.create({ data: event });
  }
}

export default new EventService();
