import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../utils/sendResponse"
import communitiesService from "../services/communities.service"

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
    return next(sendResponse(res, 500, "Error fetching communities!"))
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
    return next(sendResponse(res, 500, "Error on create communities!"))
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
    return next(sendResponse(res, 500, "Error on create post!"))
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
    return next(sendResponse(res, 500, "Error on get comments!"))
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
    return next(sendResponse(res, 500, "Error on get posts!"))
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
    return next(sendResponse(res, 500, "Error on create comment!"))
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
    return next(sendResponse(res, 500, "Error on create reaction!"))
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
    return next(sendResponse(res, 500, "Error on get reactions!"))
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
    return next(sendResponse(res, 500, "Error on added a community member!"))
  }
}
