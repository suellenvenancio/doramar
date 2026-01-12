import type { Actor } from "@/types"
import { apiClient } from "@/utils/client"

export const actorService = {
  async makeActorFavorite(userId: string, actorId: string): Promise<Actor> {
    return await apiClient.post(`/actors/user/${userId}/favorite`, {
      userId,
      actorId,
    })
  },
  async findFavoriteActorsByUserId(userId: string): Promise<Actor[]> {
    return await apiClient.get(`/actors/favorite/user/${userId}`)
  },
}
