import { z } from "zod";

export const ingredientSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

export type Ingredient = z.infer<typeof ingredientSchema>;
