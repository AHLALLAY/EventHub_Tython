import { z } from "zod";

export const eventSchema = z.object({
  title: z.string(),
  description: z.string().optional().nullable(),
  location: z.string(),
  eventDate: z.coerce.date(),
  maxParticipants: z.coerce.number().int().positive(),
  status: z.enum(["draft", "published", "cancelled"]).default("draft"),
});
