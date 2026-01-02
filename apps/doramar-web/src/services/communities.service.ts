import { AuthService } from "./auth.service"
import type {
  Comment,
  Community,
  Member,
  Post,
  Reaction,
  ReactionTargetType,
  ReactionType,
} from "@/types"
import { AxiosWrapper } from "@/utils/client"

const apiClient = new AxiosWrapper()

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
}
