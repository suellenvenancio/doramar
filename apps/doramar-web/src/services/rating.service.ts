import type { RatingWithTvShow } from "@/types"
import { AxiosWrapper } from "@/utils/client"

const apiClient = new AxiosWrapper()

export const ratingService = {
  async createRating(userId: string, tvShowId: string, scaleId: number) {
    return await apiClient.post(`/ratings`, {
      userId,
      tvShowId,
      scaleId,
    })
  },

  async getRatingsByUserId(userId: string): Promise<RatingWithTvShow[]> {
    return await apiClient.get(`/ratings/user/${userId}`)
  },
}
