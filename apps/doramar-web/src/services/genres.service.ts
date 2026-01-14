import { apiClient } from "@/utils/client"

import type { Genre } from "../types"

export const genreService = {
  async fetchGenre(): Promise<Genre[]> {
    return await apiClient.get(`/genres`)
  },
}
