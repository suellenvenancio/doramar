import { z } from "zod"

export const listSchema = z.object({
  name: z.string().min(4),
  userId: z.string(),
})
