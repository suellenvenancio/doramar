import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../utils/sendResponse"
import communitiesService from "../services/communities.service"
import { AppError } from "@/utils/errors"

export async function getAllCommunities(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const communities = await communitiesService.getAllCommunities()
    return sendResponse(
      res,
      200,
      "Communities retrieved successfully!",
      communities,
    )
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error fetching communities!",
      ),
    )
  }
}

export async function createCommunity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, userId, visibility } = req.body

    const communities = await communitiesService.createCommunity({
      name,
      ownerId: userId,
      visibility,
    })
    return sendResponse(
      res,
      200,
      "Community created successfully!",
      communities,
    )
  } catch (error) {
    console.log(error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error on create communities!",
      ),
    )
  }
}

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { communityId, userId, content } = req.body

    const post = await communitiesService.createPost({
      communityId,
      userId,
      content,
    })
    return sendResponse(res, 200, "Post created successfully!", post)
  } catch (error) {
    console.log(error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error on create post!",
      ),
    )
  }
}

export async function getPostComments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { postId } = req.params

    const post = await communitiesService.getPostComments(postId)
    return sendResponse(res, 200, "Post created successfully!", post)
  } catch (error) {
    console.log(error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error on get comments!",
      ),
    )
  }
}

export async function getPostsByCommunityId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { communityId } = req.params

    const post = await communitiesService.getPostByCommunityId(communityId)
    return sendResponse(res, 200, "Post created successfully!", post)
  } catch (error) {
    console.log(error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error on get posts!",
      ),
    )
  }
}

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { postId } = req.params
    const { communityId, userId, content } = req.body

    const post = await communitiesService.createComment({
      communityId,
      userId,
      content,
      postId,
    })
    return sendResponse(res, 200, "Post created successfully!", post)
  } catch (error) {
    console.log(error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error on create comment!",
      ),
    )
  }
}

export async function createReaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { postId } = req.params
    const { communityId, userId, targetType, type } = req.body

    const reaction = await communitiesService.createReaction({
      communityId,
      userId,
      postId,
      targetType,
      type,
    })
    return sendResponse(res, 200, "Post created successfully!", reaction)
  } catch (error) {
    console.log(error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error on create reaction!",
      ),
    )
  }
}

export async function getReactionsByPostId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { postId } = req.params

    const reactions = await communitiesService.getReactionsByPostId(postId)

    return sendResponse(res, 200, "Post created successfully!", reactions)
  } catch (error) {
    console.log(error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error on get reactions!",
      ),
    )
  }
}

export async function addMemberOnTheCommunity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { communityId } = req.params
    const { userId, role } = req.body
    console.log(userId)

    const post = await communitiesService.addCommunityMember({
      communityId,
      userId,
      role,
    })

    return sendResponse(res, 200, "Member added successfully!", post)
  } catch (error) {
    console.log(error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Member added successfully!",
      ),
    )
  }
}

export async function uploadCommunityProfilePicture(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const file = req.file
    if (!file) {
      return sendResponse(res, 400, "No file uploaded!")
    }
    const { communityId } = req.params
    const communityWithAvatar =
      await communitiesService.uploadCommunityProfilePicture(communityId, file)
    return sendResponse(
      res,
      200,
      "Community profile picture uploaded successfully!",
      communityWithAvatar,
    )
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message ||
          "Error on upload community profile picture!",
      ),
    )
  }
}

export async function uploadCommunityCoverPicture(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const file = req.file
    if (!file) {
      return sendResponse(res, 400, "No file uploaded!")
    }
    const { communityId } = req.params
    const communityWithAvatar =
      await communitiesService.uploadCommunityCoverPicture(communityId, file)
    return sendResponse(
      res,
      200,
      "Community profile picture uploaded successfully!",
      communityWithAvatar,
    )
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message ||
          "Error on upload community profile picture!",
      ),
    )
  }
}

export async function deleteCommunity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { communityId } = req.params

    await communitiesService.deleteCommunity(communityId)

    return sendResponse(res, 200, "Community deleted successfully!")
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error on delete community!",
      ),
    )
  }
}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { postId, communityId } = req.params
    await communitiesService.deletePost(postId, communityId)

    return sendResponse(res, 200, "Post deleted successfully!")
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error on delete post!",
      ),
    )
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { postId, communityId, commentId } = req.params

    await communitiesService.deleteComment({ postId, communityId, commentId })

    return sendResponse(res, 200, "Comment deleted successfully!")
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error on delete post!",
      ),
    )
  }
}
