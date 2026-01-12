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
          setCommunities((prev) => [...prev, newCommunity]),
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
    content: string,
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
    userId: string,
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
            }),
          )
        })
        .catch((e) => toast("Erro ao adicionar participante"))
    } catch (error) {
      console.error("Erro ao adicionar participante a comunidade", error)
    }
  }

  const uploadCommunityProfilePicture = async ({
    communityId,
    formData,
  }: {
    communityId: string
    formData: FormData
  }) => {
    console.log(formData)
    try {
      return await communitiesService
        .uploadCommunityProfilePicture({
          communityId,
          formData,
        })
        .then((communityWithNewAvatar) => {
          setCommunities((prev) =>
            prev.map((community) =>
              community.id === communityWithNewAvatar.id
                ? communityWithNewAvatar
                : community,
            ),
          )
          return communityWithNewAvatar
        })
        .catch(() => {
          toast("Erro ao fazer upload da imagem do perfil da comunidade")
        })
    } catch (error) {
      console.error(
        "Erro ao fazer upload da imagem do perfil da comunidade",
        error,
      )
    }
  }

  const uploadCommunityCoverPicture = async ({
    communityId,
    formData,
  }: {
    communityId: string
    formData: FormData
  }) => {
    try {
      await communitiesService
        .uploadCommunityCoverPicture({
          communityId,
          formData,
        })
        .then((communityWithNewCoverPicture) => {
          setCommunities((prev) =>
            prev.map((community) =>
              community.id === communityWithNewCoverPicture.id
                ? communityWithNewCoverPicture
                : community,
            ),
          )
          return communityWithNewCoverPicture
        })
        .catch(() => {
          toast("Erro ao fazer upload da imagem de capa da comunidade")
        })
    } catch (error) {
      console.error(
        "Erro ao fazer upload da imagem de capa da comunidade",
        error,
      )
    }
  }

  const deleteCommunity = async (communityId: string) => {
    try {
      await communitiesService.deleteCommunity(communityId)
      setCommunities((prev) =>
        prev.filter((community) => community.id !== communityId),
      )
      toast("Comunidade deletada com sucesso!")
    } catch (error) {
      console.error("Erro ao deletar comunidade", error)
      toast("Erro ao deletar comunidade")
    }
  }

  const deletePost = async (postId: string, communityId: string) => {
    try {
      await communitiesService.deletePost(postId, communityId)
      toast("Post deletado com sucesso!")
    } catch (error) {
      console.error("Erro ao deletar post", error)
      toast("Erro ao deletar post")
    }
  }

  const deleteComment = async (params: {
    commentId: string
    communityId: string
    postId: string
  }) => {
    try {
      await communitiesService.deleteComment(params)
      toast("Comentário deletado com sucesso!")
    } catch (error) {
      console.error("Erro ao deletar comentário", error)
      toast("Erro ao deletar comentário")
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
    uploadCommunityProfilePicture,
    uploadCommunityCoverPicture,
    deleteCommunity,
    deletePost,
    deleteComment,
  }
}
