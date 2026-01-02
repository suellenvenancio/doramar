import { z } from "zod"

export const ratingSchema = z.object({
  userId: z.string(),
  tvShowId: z.string(),
  scaleId: z.number().min(1).max(5),
})
