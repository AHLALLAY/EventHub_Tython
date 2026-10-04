import prisma from "../config/prisma.js";

class StatisticsService {
  async eventTotal() {
    return await prisma.event.count();
  }

  async publishedEventTotal() {
    return await prisma.event.count({
      where: { status: "published" },
    });
  }

  async registrationsTotalByDay() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return await prisma.registration.count({
      where: { createdAt: { gte: start, lt: end } },
    });
  }

  async topFiveEvent() {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: {
            registrations: {
              where: { status: { in: ["pending", "confirmed"] } },
            },
          },
        },
      },
    });

    // Tri sur les inscriptions actives uniquement
    return events
      .sort((a, b) => b._count.registrations - a._count.registrations)
      .slice(0, 5);
  }
}

export default new StatisticsService();
