import {
  CommunityRole,
  CommunityVisibility,
  ReactionTargetType,
  ReactionType,
} from "@prisma/client"
import communitiesRepository from "../repository/communities.repository"
import userRepository from "../repository/user.repository"
import { AppError } from "../utils/errors"
import { uploadImage } from "../utils/upload-image-vercel"

async function getAllCommunities() {
  try {
    const communities = await communitiesRepository.getAllCommunities()
    return communities.map((c) => {
      return {
        name: c.name,
        description: c.description,
        visibility: c.visibility,
        coverUrl: c.coverUrl,
        avatarUrl: c.avatarUrl,
        rules: c.rules,
        createdAt: c.createdAt,
        id: c.id,
        owner: c.owner,
        members: c.members,
      }
    })
  } catch (error) {
    console.error("Erro ao buscar comunidades!")
    throw error
  }
}

async function createCommunity({
  name,
  ownerId,
  visibility,
}: {
  name: string
  ownerId: string
  visibility: CommunityVisibility
}) {
  try {
    const community = await communitiesRepository.createCommunity({
      name,
      ownerId,
      visibility,
    })

    if (!community) {
      throw new AppError("Error on create community", 400)
    }

    const communityMember = await communitiesRepository.addCommunityMember({
      communityId: community.id,
      userId: ownerId,
    })

    return {
      ...community,
      members: communityMember ? [communityMember] : [],
    }
  } catch (error) {
    console.error(`Erro ao criar comunidades!: ${error}`)
  }
}

async function createPost({
  communityId,
  userId,
  content,
}: {
  communityId: string
  userId: string
  content: string
}) {
  try {
    const user = await userRepository.findUserById(userId)

    if (!user) {
      throw new AppError("User not found!", 404)
    }

    const community = await communitiesRepository.findCommunityById(communityId)

    if (!community) {
      throw new AppError("Community not found!", 404)
    }

    const userIsMemberofTheCommunity = community.members.some(
      (m) => m.userId === userId,
    )

    if (!userIsMemberofTheCommunity) {
      throw new AppError(
        "User has no permission to do comment in this post!",
        404,
      )
    }

    return await communitiesRepository.createCommunityPost({
      communityId,
      userId,
      content,
    })
  } catch (error) {
    console.error(`Erro ao criar post!: ${error}`)
    throw error
  }
}

async function getPostComments(postId: string) {
  try {
    return await communitiesRepository.getCommentsByPostId(postId)
  } catch (error) {
    console.error(`Error on get the comments!: ${error}`)
    throw error
  }
}

async function getPostByCommunityId(communityId: string) {
  try {
    return await communitiesRepository.getPostsByCommunityId(communityId)
  } catch (error) {
    console.error(`Error on get the comments!: ${error}`)
    throw error
  }
}

async function createComment({
  communityId,
  userId,
  content,
  postId,
}: {
  communityId: string
  userId: string
  content: string
  postId: string
}) {
  try {
    const user = await userRepository.findUserById(userId)

    if (!user) {
      throw new AppError("User not found!", 404)
    }

    const community = await communitiesRepository.findCommunityById(communityId)

    if (!community) {
      throw new AppError("Community not found!", 404)
    }

    const userIsMemberofTheCommunity = community.members.some(
      (m) => m.userId === userId,
    )

    if (!userIsMemberofTheCommunity) {
      throw new AppError(
        "User has no permission to do comment in this post!",
        403,
      )
    }

    return await communitiesRepository.createPostComment({
      communityId,
      userId,
      content,
      postId,
    })
  } catch (error) {
    console.error(`Erro ao criar comentario!: ${error}`)
    throw error
  }
}

async function createReaction({
  communityId,
  userId,
  targetType,
  type,
  postId,
}: {
  communityId: string
  userId: string
  postId: string
  targetType: ReactionTargetType
  type: ReactionType
}) {
  try {
    const user = await userRepository.findUserById(userId)

    if (!user) {
      throw new AppError("User not found!", 404)
    }

    const community = await communitiesRepository.findCommunityById(communityId)

    if (!community) {
      throw new AppError("Community not found!", 404)
    }

    const userIsMemberofTheCommunity = community.members.some(
      (m) => m.userId === userId,
    )

    if (!userIsMemberofTheCommunity) {
      throw new AppError("User has no permission to comment in this post!", 403)
    }

    const post = await communitiesRepository.findPostById(postId)

    if (!post) {
      throw new AppError("Post not found!", 404)
    }

    const communityHasThePost = community.posts.some((p) => p.id === postId)

    if (!communityHasThePost) {
      throw new AppError("Post dont belong to this community!", 404)
    }

    const reaction = post.reactions.find((r) => r.userId === userId)

    if (!reaction) {
      return await communitiesRepository.createReaction({
        userId,
        postId,
        targetType,
        type,
      })
    }

    if (reaction.type === type) {
      return await communitiesRepository.deleteReaction(reaction.id)
    }

    if (reaction.type !== type) {
      return await communitiesRepository.updateReaction({
        id: reaction.id,
        type,
      })
    }
  } catch (error) {
    console.error(`Erro ao criar comentario!: ${error}`)
    throw error
  }
}

async function getReactionsByPostId(postId: string) {
  try {
    return await communitiesRepository.findReactionsByPostId(postId)
  } catch (error) {
    console.error(`Error on get the comments!: ${error}`)
    throw error
  }
}

async function addCommunityMember({
  communityId,
  role,
  userId,
}: {
  communityId: string
  userId: string
  role?: CommunityRole
}) {
  const community = await communitiesRepository.findCommunityById(communityId)

  if (!community) {
    throw new AppError("Community doesn't exist!", 404)
  }

  return await communitiesRepository.addCommunityMember({
    communityId,
    userId,
    role,
  })
}

async function uploadCommunityProfilePicture(
  communityId: string,
  avatarUrl: Express.Multer.File,
) {
  try {
    const community = await communitiesRepository.findCommunityById(communityId)

    if (!community) {
      throw new AppError("Community not found!", 404)
    }

    const blob = await uploadImage(avatarUrl)

    return await communitiesRepository.updateCommunityProfilePicture(
      communityId,
      blob.url,
    )
  } catch (error) {
    console.error(`Error on upload community profile picture!: ${error}`)
    throw error
  }
}

async function uploadCommunityCoverPicture(
  communityId: string,
  coverUrl: Express.Multer.File,
) {
  try {
    const community = await communitiesRepository.findCommunityById(communityId)

    if (!community) {
      throw new AppError("Community not found!", 404)
    }

    const blob = await uploadImage(coverUrl)

    return await communitiesRepository.updateCommunityCoverPicture(
      communityId,
      blob.url,
    )
  } catch (error) {
    console.error(`Error on upload community cover picture!: ${error}`)
    throw error
  }
}

async function deleteCommunity(communityId: string) {
  try {
    const community = await communitiesRepository.findCommunityById(communityId)

    if (!community) {
      throw new AppError("Community not found!", 404)
    }

    await communitiesRepository.deleteCommunityById(communityId)
  } catch (error) {
    console.error(`Error on delete community!: ${error}`)
    throw error
  }
}

async function deletePost(postId: string, communityId: string) {
  try {
    const post = await communitiesRepository.findPostById(postId)

    if (!post) {
      throw new AppError("Post not found!", 404)
    }

    const community = await communitiesRepository.findCommunityById(communityId)
    if (!community) {
      throw new AppError("Community not found!", 404)
    }

    const communityHasThePost = community.posts.some((p) => p.id === postId)

    if (!communityHasThePost) {
      throw new AppError("Post dont belong to this community!", 404)
    }

    await communitiesRepository.deletePostById(postId)
  } catch (error) {
    console.error(`Error on delete post!: ${error}`)
    throw error
  }
}

async function deleteComment({
  commentId,
  postId,
  communityId,
}: {
  commentId: string
  postId: string
  communityId: string
}) {
  try {
    const comment = await communitiesRepository.findCommentById(commentId)

    if (!comment) {
      throw new AppError("Comment not found!", 404)
    }

    const post = await communitiesRepository.findPostById(postId)

    if (!post) {
      throw new AppError("Post not found!", 404)
    }

    const postHasTheComment = post.comments.some((c) => c.id === commentId)

    if (!postHasTheComment) {
      throw new AppError("Comment dont belong to this post!", 404)
    }

    const community = await communitiesRepository.findCommunityById(communityId)

    if (!community) {
      throw new AppError("Community not found!", 404)
    }

    const communityHasThePost = community.posts.some((p) => p.id === postId)

    if (!communityHasThePost) {
      throw new AppError("Post dont belong to this community!", 404)
    }

    await communitiesRepository.deleteCommentById(commentId)
  } catch (error) {
    console.error(`Error on delete comment!: ${error}`)
    throw error
  }
}

const communitiesService = {
  getAllCommunities,
  createCommunity,
  createPost,
  getPostComments,
  getPostByCommunityId,
  createComment,
  createReaction,
  getReactionsByPostId,
  addCommunityMember,
  uploadCommunityProfilePicture,
  uploadCommunityCoverPicture,
  deleteCommunity,
  deletePost,
  deleteComment,
}

export default communitiesService
