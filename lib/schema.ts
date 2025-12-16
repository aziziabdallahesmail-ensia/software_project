import z from "zod";

export const docformschema = z.object({
  specialty: z.string().min(1, "requise"),
  experience: z
    .number({ error: "L'expérience doit être un nombre" })
    .int()
    .min(3, "L'expérience doit être d'au moins 3 ans"),
  credentialUrl: z
    .string()
    .url("Veuillez entrer une URL valide")
    .min(1, "L'URL des credentials est requise"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(1000, "La description ne peut pas dépasser 1000 caractères"),
});