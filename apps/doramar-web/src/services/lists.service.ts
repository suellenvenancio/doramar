import type { List, ListWithTvShows, TvShow } from "@/types"
import { apiClient } from "@/utils/client"

export const listService = {
  async getListsByUserId(userId: string): Promise<List[]> {
    return await apiClient.get(`/lists/user/${userId}`)
  },

  async addTvShowToList(
    listId: string,
    tvShowId: string,
    userId: string,
  ): Promise<ListWithTvShows> {
    return await apiClient.post(`/lists/${listId}/tvShow/${tvShowId}`, {
      userId,
    })
  },

  async createList(name: string, userId: string): Promise<List> {
    return await apiClient.post(`/lists`, { name, userId })
  },

  async deleteList(listId: string): Promise<void> {
    return await apiClient.delete(`/lists/${listId}`)
  },

  async removeTvShowFromTheList({
    listId,
    tvShowId,
    userId,
  }: {
    listId: string
    tvShowId: string
    userId: string
  }): Promise<void> {
    return await apiClient.delete(
      `/lists/${listId}/tvShow/${tvShowId}/user/${userId}`,
    )
  },

  async updaListOrder({
    tvShows,
    listId,
    userId,
  }: {
    tvShows: TvShow[]
    listId: string
    userId: string
  }): Promise<ListWithTvShows> {
    return await apiClient.post(`/lists/${listId}`, {
      tvShows,
      userId,
    })
  },
}
