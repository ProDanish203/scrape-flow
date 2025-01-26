import { z } from "zod";

export const createCredentialSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Name must be 30 characters or less"),
  value: z
    .string()
    .min(1, "Value is required")
    .max(500, "Description must be 80 characters or less"),
});

export type createCredentialSchemaType = z.infer<typeof createCredentialSchema>;
