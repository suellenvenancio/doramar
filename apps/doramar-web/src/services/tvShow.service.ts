import {
  type TvShow,
  type TvShowWithPagination,
  type WatchedTvShow,
} from "@/types"
import { apiClient } from "@/utils/client"

export const tvShowService = {
  async getAllTvShows(): Promise<TvShow[]> {
    return await apiClient.get(`/tvShows/all`)
  },

  async getWatchedStatus(): Promise<{ id: number; label: string }[]> {
    return await apiClient.get(`/tvShows/watched/status`)
  },

  async markTvShowAsWatched(
    userId: string,
    tvShowId: string,
    watchedStatusId: string,
  ): Promise<WatchedTvShow> {
    return await apiClient.post(`/tvShows/watched`, {
      userId,
      tvShowId,
      watchedStatusId,
    })
  },

  async getWatchedTvShowsByUserId(userId: string): Promise<WatchedTvShow[]> {
    return await apiClient.get(`/tvShows/watched/user/${userId}`)
  },

  async getTvShowsByPage(
    page: number,
    limit?: number,
  ): Promise<TvShowWithPagination> {
    return await apiClient.get(`/tvShows?page=${page}&limit=${limit}`)
  },

  async findFavoriteTvShowByUserId(userId: string): Promise<TvShow> {
    console.log(userId, "****")
    return await apiClient.get(`/tvShows/favorite/user/${userId}`)
  },

  async addTVShowToFavorites(
    userId: string,
    tvShowId: string,
  ): Promise<TvShow> {
    return await apiClient.post(`/tvShows/user/${userId}/favoriteTvShow`, {
      tvShowId,
    })
  },
}
