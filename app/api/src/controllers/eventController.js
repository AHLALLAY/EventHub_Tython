import {
  eventSchema,
  updateEventSchema,
  updateEventStatusSchema,
} from "../schemas/eventSchema.js";
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

export const getAllEvents = async (req, res) => {
  try {
    const { status, date } = req.query;

    const events = await eventService.getAllEvents({ status, date });
    return res.status(200).json(events);
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

export const getOneEvent = async (req, res) => {
  try {
    const event = await eventService.getOneEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement introuvable" });
    }
    return res.status(200).json(event);
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await eventService.getOneEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement introuvable" });
    }
    const parsed = updateEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Données invalides",
        errors: parsed.error.issues.map((i) => i.message),
      });
    }
    
    const data = await eventService.updateEvent(req.params.id, parsed.data);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const event = await eventService.getOneEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement introuvable" });
    }
    const parsed = updateEventStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Données invalides",
        errors: parsed.error.issues.map((i) => i.message),
      });
    }

    const data = await eventService.updateEventStatus(
      req.params.id,
      parsed.data.status,
    );
    return res.status(200).json(data);
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};
