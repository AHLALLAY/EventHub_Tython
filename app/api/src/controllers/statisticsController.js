import statisticsService from "../services/statisticsService.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [totalEvents, publishedEvents, registrationsToday, topEvents] =
      await Promise.all([
        statisticsService.eventTotal(),
        statisticsService.publishedEventTotal(),
        statisticsService.registrationsTotalByDay(),
        statisticsService.topFiveEvent(),
      ]);

    return res.status(200).json({
      totalEvents,
      publishedEvents,
      registrationsToday,
      topEvents,
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};
