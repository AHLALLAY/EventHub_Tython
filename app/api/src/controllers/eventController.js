import { eventSchema } from "../schemas/eventSchema.js";
import eventService from "../services/eventService.js";

export const createEvent = async (req, res) => {
  try {
    const parsed = eventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Données invalides",
        errors: parsed.error.issues.map((i) => i.message),
      });
    }

    const data = await eventService.createEvent({
      ...parsed.data,
      createdBy: req.user.id,
    });
    return res.status(201).json(data);
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};
