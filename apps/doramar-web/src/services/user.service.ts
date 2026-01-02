import type { createUser, User } from "@/types"

import { AxiosWrapper } from "@/utils/client"

const apiClient = new AxiosWrapper()

export const userService = {
  async getAttractionsByUser(user: createUser): Promise<User> {
    return await apiClient.post(`/users`, user)
  },

  async findUserById(userId: string): Promise<User> {
    return await apiClient.get(`/users/${userId}`)
  },

  async findUserByEmail(email: string): Promise<User> {
    return await apiClient.get(`/users?email=${email}`)
  },

  async addTVShowToFavorites(userId: string, tvShowId: string): Promise<User> {
    return await apiClient.post(`/users/${userId}/favoriteTvShow`, {
      tvShowId,
    })
  },

  async createUser(data: {
    name: string
    username: string
    email: string
    profilePicture?: string
  }): Promise<User> {
    return await apiClient.post("/users", data)
  },

  async uploadProfilePicture({
    userId,
    formData,
  }: {
    userId: string
    formData: FormData
  }): Promise<User> {
    return await apiClient.post(`/users/${userId}/profilePicture`, formData)
  },

  async findUserByUsername(username: string): Promise<User> {
    return await apiClient.get(`/users?username=${username}`)
  },
}
