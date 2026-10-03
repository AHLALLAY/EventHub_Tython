import { participantSchema } from "../schemas/participantSchema.js";
import participantService from "../services/participantService.js";

export const createParticipant = async (req, res) => {
  try {
    const parsed = participantSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Données invalides",
        errors: parsed.error.issues.map((i) => i.message),
      });
    }

    const data = await participantService.createParticipant(parsed.data);
    return res.status(201).json(data);
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({
        message: "Cet email est déjà utilisé",
      });
    }
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

export const getParticipants = async (req, res) => {
  try {
    const { search } = req.query;
    const data = await participantService.getParticipants(search);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

export const updateParticipant = async (req, res) => {
  try {
    const parsed = participantSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Données invalides",
        errors: parsed.error.issues.map((i) => i.message),
      });
    }
    const data = await participantService.updateParticipant(
      req.params.id,
      parsed.data,
    );
    return res.status(200).json(data);
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ message: "Participant introuvable" });
    }
    if (e.code === "P2002") {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};
