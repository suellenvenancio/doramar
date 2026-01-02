import { useEffect, useState } from "react"
import type { Community, ReactionTargetType, ReactionType } from "@/types"
import { communitiesService } from "@/services/communities.service"
import { useUser } from "./use-user"
import { toast } from "@/components/toast"

export function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([])

  const { user } = useUser()
  const userId = user?.id

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const fetchedCommunities = await communitiesService.getAllCommunities()
        setCommunities(fetchedCommunities)
      } catch (error) {
        console.error("Failed to fetch communities:", error)
      }
    }
    fetchCommunities()
  }, [])

  const createCommunity = async ({
    description,
    name,
    visibility,
  }: {
    name: string
    visibility: string
    description?: string
  }) => {
    if (!userId) return
    try {
      communitiesService
        .createCommunity({
          name,
          userId,
          visibility,
          description,
        })
        .then((newCommunity) =>
          setCommunities((prev) => [...prev, newCommunity])
        )
        .catch(() => toast("Erro ao criar a comunidade!"))
    } catch (error) {
      console.error(`Erro ao criar comunidade: ${error}`)
    }
  }

  const createPost = async ({
    communityId,
    content,
  }: {
    communityId: string
    content: string
  }) => {
    if (!userId) return null

    try {
      return communitiesService
        .createPost({ communityId, content, userId })
        .then((newPost) => newPost)
        .catch(() => toast("Erro ao criar a post!"))
    } catch (error) {
      console.error(`Erro ao criar post: ${error}`)
    }
  }

  const getCommunityPosts = async (communityId: string) => {
    if (!userId) return

    try {
      return await communitiesService.getCommunityPosts(communityId)
    } catch (error) {
      console.error(`Erro ao buscar posts: ${error}`)
    }
  }

  const getPostsComments = async (postId: string) => {
    if (!userId) return

    try {
      return await communitiesService.getPostComments(postId)
    } catch (error) {
      console.error(`Erro ao buscar comentários: ${error}`)
    }
  }

  const createComment = async (
    postId: string,
    communityId: string,
    content: string
  ) => {
    try {
      if (!userId) return

      return await communitiesService.createComment({
        postId,
        communityId,
        content,
        userId,
      })
    } catch (error) {
      console.error("Erro ao criar comentário!", error)
      return null
    }
  }

  const createReaction = async ({
    postId,
    communityId,
    targetType,
    type,
  }: {
    postId: string
    communityId: string
    targetType: ReactionTargetType
    type: ReactionType
  }) => {
    try {
      if (!userId) return

      return await communitiesService.createReaction({
        postId,
        communityId,
        userId,
        targetType,
        type,
      })
    } catch (error) {
      console.error("Erro ao criar reações!", error)
      return null
    }
  }

  const getReactionsByPostId = async (postId: string) => {
    try {
      if (!userId) return

      return await communitiesService.getReactsByPostId(postId)
    } catch (error) {
      console.error("Erro ao buscar reações!", error)
    }
  }

  const addMemberOnTheCommunity = async (
    communityId: string,
    userId: string
  ) => {
    try {
      communitiesService
        .addMemberOnTheCommunity({ communityId, userId })
        .then((newMember) => {
          setCommunities((prev) =>
            prev.map((community) => {
              if (community.id !== communityId) return community

              return {
                ...community,
                members: [...community.members, newMember],
              }
            })
          )
        })
        .catch((e) => toast("Erro ao adicionar participante"))
    } catch (error) {
      console.error("Erro ao adicionar participante a comunidade", error)
    }
  }

  return {
    communities,
    createCommunity,
    createPost,
    getPostsComments,
    getCommunityPosts,
    createComment,
    createReaction,
    getReactionsByPostId,
    addMemberOnTheCommunity,
  }
}
