import { z } from "zod";

export const registrationSchema = z.object({
  eventId: z.string().uuid("eventId invalide"),
  participantId: z.string().uuid("participantId invalide"),
  status: z.enum(["pending", "confirmed", "cancelled"]).default("pending"),
});

export const registrationStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});