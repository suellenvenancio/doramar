import type {
  Comment,
  Community,
  Member,
  Post,
  Reaction,
  ReactionTargetType,
  ReactionType,
} from "@/types"
import { apiClient } from "@/utils/client"

export const communitiesService = {
  async getAllCommunities(): Promise<Community[]> {
    return await apiClient.get("/communities")
  },
  async createCommunity(data: {
    name: string
    userId: string
    visibility: string
    description?: string
  }): Promise<Community> {
    return await apiClient.post("/communities", data)
  },
  async createPost(data: {
    communityId: string
    userId: string
    content: string
  }): Promise<Post> {
    return await apiClient.post("/communities/post", data)
  },
  async getCommunityPosts(communityId: string): Promise<Post[]> {
    return await apiClient.get(`/communities/${communityId}/posts`)
  },
  async getPostComments(postId: string): Promise<Comment[]> {
    return await apiClient.get(`/communities/post/${postId}/comments`)
  },
  async createComment({
    postId,
    userId,
    communityId,
    content,
  }: {
    postId: string
    userId: string
    content: string
    communityId: string
  }): Promise<Comment> {
    return await apiClient.post(`/communities/post/${postId}/comments`, {
      userId,
      communityId,
      content,
    })
  },
  async createReaction({
    postId,
    userId,
    communityId,
    targetType,
    type,
  }: {
    postId: string
    userId: string
    communityId: string
    targetType: ReactionTargetType
    type: ReactionType
  }): Promise<Reaction> {
    return await apiClient.post(`/communities/post/${postId}/reactions`, {
      userId,
      communityId,
      postId,
      targetType,
      type,
    })
  },
  async getReactsByPostId(postId: string): Promise<Reaction[]> {
    return await apiClient.get(`/communities/post/${postId}/reactions`)
  },

  async addMemberOnTheCommunity({
    communityId,
    userId,
  }: {
    communityId: string
    userId: string
  }): Promise<Member> {
    return await apiClient.post(`/communities/${communityId}/members`, {
      userId,
    })
  },
  async uploadCommunityProfilePicture({
    communityId,
    formData,
  }: {
    formData: FormData
    communityId: string
  }): Promise<Community> {
    return await apiClient.patch(`/communities/${communityId}/avatar`, formData)
  },
  async uploadCommunityCoverPicture({
    communityId,
    formData,
  }: {
    formData: FormData
    communityId: string
  }): Promise<Community> {
    return await apiClient.patch(`/communities/${communityId}/cover`, formData)
  },

  async deleteCommunity(communityId: string): Promise<void> {
    return await apiClient.delete(`/communities/${communityId}`)
  },

  async deletePost(postId: string, communityId: string): Promise<void> {
    return await apiClient.delete(`/communities/${communityId}/post/${postId}`)
  },

  async deleteComment({
    commentId,
    communityId,
    postId,
  }: {
    commentId: string
    communityId: string
    postId: string
  }): Promise<void> {
    return await apiClient.delete(
      `/communities/${communityId}/post/${postId}/comments/${commentId}`,
    )
  },
}
