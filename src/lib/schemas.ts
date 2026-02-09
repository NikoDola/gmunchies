import { z } from "zod";

export const heroSchema = z.object({
  headline: z.string().min(1),
  body: z.string().min(1),
  image: z.string().startsWith("/uploads/"),
});
