import {
  registrationSchema,
  registrationStatusSchema,
} from "../schemas/registrationSchema.js";
import registrationService from "../services/registrationService.js";

export const createRegistration = async (req, res) => {
  try {
    const parsed = registrationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Données invalides",
        errors: parsed.error.issues.map((i) => i.message),
      });
    }
    const data = await registrationService.createRegistration(parsed.data);
    return res.status(201).json(data);
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({
        message: "Ce participant est déjà inscrit à cet événement",
      });
    }
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

export const getRegistrations = async (req, res) => {
  try {
    const { eventId, status } = req.query;
    const data = await registrationService.getRegistrations({
      eventId,
      status,
    });
    return res.status(200).json(data);
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

export const updateRegistrationStatus = async (req, res) => {
  try {
    const parsed = registrationStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Données invalides",
        errors: parsed.error.issues.map((i) => i.message),
      });
    }
    const data = await registrationService.updateRegistrationStatus(
      req.params.id,
      parsed.data.status,
    );
    return res.status(200).json(data);
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({
        message: "Inscription introuvable",
      });
    }
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};
