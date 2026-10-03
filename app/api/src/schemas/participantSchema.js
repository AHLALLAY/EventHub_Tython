import { z } from "zod";

export const participantSchema = z.object({
  fullName: z.string().min(4),
  email: z.string().email("Email invalide"),
  phone: z.string().optional().nullable(),
});
