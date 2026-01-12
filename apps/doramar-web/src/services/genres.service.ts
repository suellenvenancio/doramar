import type { Genre } from "../types"
import { apiClient } from "@/utils/client"

export const genreService = {
  async fetchGenre(): Promise<Genre[]> {
    return await apiClient.get(`/genres`)
  },
}
