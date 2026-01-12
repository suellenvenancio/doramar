import {
  CommunityRole,
  CommunityVisibility,
  ReactionTargetType,
  ReactionType,
} from "@prisma/client"
import { prisma } from "../lib/prisma"

async function getAllCommunities() {
  return await prisma.communities.findMany({
    include: {
      members: {
        include: {
          user: true,
        },
      },

      posts: {
        include: {
          author: {
            include: {},
          },
        },
      },
      owner: true,
    },
  })
}

async function findCommunityById(id: string) {
  return await prisma.communities.findFirst({
    where: { id },
    include: {
      members: true,
      posts: true,
      owner: true,
    },
  })
}

async function getPostsByCommunityId(communityId: string) {
  return await prisma.posts.findMany({
    where: {
      communityId,
    },
    include: {
      author: true,
      comments: true,
      reactions: true,
    },
  })
}

async function createCommunity({
  name,
  visibility,
  ownerId,
}: {
  name: string
  ownerId: string
  visibility: CommunityVisibility
}) {
  return await prisma.communities.create({
    data: {
      name,
      visibility,
      createdAt: new Date(),
      ownerId,
    },
    include: {
      members: true,
      posts: true,
      owner: true,
    },
  })
}

function addCommunityMember({
  communityId,
  role = CommunityRole.MEMBER,
  userId,
}: {
  communityId: string
  userId: string
  role?: CommunityRole
}) {
  return prisma.communityMember.create({
    data: {
      userId,
      communityId,
      joinedAt: new Date(),
      role: role,
      status: "APPROVED",
    },
    include: {
      user: true,
    },
  })
}

async function createCommunityPost({
  communityId,
  content,
  userId,
}: {
  communityId: string
  content: string
  userId: string
}) {
  return await prisma.posts.create({
    data: {
      communityId,
      content,
      userId,
    },
    include: {
      author: true,
    },
  })
}

async function createPostComment({
  communityId,
  postId,
  content,
  userId,
}: {
  communityId: string
  postId: string
  content: string
  userId: string
}) {
  return await prisma.comment.create({
    data: {
      postId,
      content,
      userId,
    },
    include: {
      author: true,
    },
  })
}

async function getCommentsByPostId(postId: string) {
  return await prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      author: true,
    },
  })
}

async function findPostById(id: string) {
  return await prisma.posts.findFirst({
    where: {
      id,
    },
    include: {
      author: true,
      reactions: true,
      comments: true,
    },
  })
}

async function findReactionsByPostId(postId: string) {
  return await prisma.reactions.findMany({
    where: {
      postId,
    },
  })
}

async function createReaction({
  targetType,
  type,
  postId,
  userId,
}: {
  targetType: ReactionTargetType
  type: ReactionType
  postId: string
  userId: string
}) {
  return await prisma.reactions.create({
    data: {
      targetType,
      type,
      postId,
      userId,
      createdAt: new Date(),
    },
  })
}

async function updateReaction({
  type,
  id,
}: {
  type: ReactionType
  id: string
}) {
  return await prisma.reactions.update({
    where: {
      id,
    },
    data: {
      type,
    },
  })
}

async function deleteReaction(id: string) {
  return await prisma.reactions.delete({
    where: {
      id,
    },
  })
}

async function updateCommunityProfilePicture(
  communityId: string,
  profilePictureUrl: string,
) {
  return await prisma.communities.update({
    where: {
      id: communityId,
    },
    data: {
      avatarUrl: profilePictureUrl,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      owner: true,
    },
  })
}

async function updateCommunityCoverPicture(
  communityId: string,
  coverPictureUrl: string,
) {
  return await prisma.communities.update({
    where: {
      id: communityId,
    },
    data: {
      coverUrl: coverPictureUrl,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      owner: true,
    },
  })
}

async function deleteCommunityById(id: string) {
  return await prisma.communities.delete({
    where: {
      id,
    },
  })
}

async function deletePostById(id: string) {
  return await prisma.posts.delete({
    where: {
      id,
    },
  })
}

async function findCommentById(id: string) {
  return await prisma.comment.findUnique({
    where: {
      id,
    },
  })
}

async function deleteCommentById(id: string) {
  return await prisma.comment.delete({
    where: {
      id,
    },
  })
}

const communitiesRepository = {
  getAllCommunities,
  findCommunityById,
  getPostsByCommunityId,
  createCommunity,
  addCommunityMember,
  createCommunityPost,
  createPostComment,
  getCommentsByPostId,
  findPostById,
  findReactionsByPostId,
  createReaction,
  updateReaction,
  deleteReaction,
  updateCommunityProfilePicture,
  updateCommunityCoverPicture,
  deleteCommunityById,
  deletePostById,
  findCommentById,
  deleteCommentById,
}

export default communitiesRepository
