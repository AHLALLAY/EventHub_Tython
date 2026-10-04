import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe requis"),
  fullName: z.string().min(1, "nom requis"),
  role: z.enum(["admin", "staff"]),
});
