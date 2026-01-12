import type { createUser, User } from "@/types"

import { apiClient } from "@/utils/client"

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

  async createUser(data: {
    name: string
    username: string
    email: string
    profilePicture?: string
    password: string
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
}
