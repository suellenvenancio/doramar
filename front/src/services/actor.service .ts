import type { Actor } from "@/types"
import { AxiosWrapper } from "@/utils/client"

const apiClient = new AxiosWrapper()

export const actorService = {
  async makeActorFavorite(userId: string, actorId: string): Promise<Actor> {
    return await apiClient.post(`/actors/user/${userId}/favorite`, {
      userId,
      actorId,
    })
  },
}
