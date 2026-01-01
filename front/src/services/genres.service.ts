import type { Genre } from "../types"
import { AxiosWrapper } from "@/utils/client"

const apiClient = new AxiosWrapper()

export const genreService = {
  async fetchGenre(): Promise<Genre[]> {
    return await apiClient.get(`/genres`)
  },
}
