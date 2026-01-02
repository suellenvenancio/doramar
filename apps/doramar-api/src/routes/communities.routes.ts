import express from "express"
import { authenticate } from "../middleware"
import {
  addMemberOnTheCommunity,
  createComment,
  createCommunity,
  createPost,
  createReaction,
  getAllCommunities,
  getPostComments,
  getPostsByCommunityId,
  getReactionsByPostId,
} from "../controller/communities.controller"

export function communitiesRoutes() {
  const router = express.Router()

  router.get("/", authenticate, getAllCommunities)
  router.post("/", authenticate, createCommunity)
  router.post("/post", authenticate, createPost)
  router.post("/post/:postId/comments", authenticate, createComment)
  router.get("/post/:postId/comments", authenticate, getPostComments)
  router.get("/:communityId/posts", authenticate, getPostsByCommunityId)
  router.post("/post/:postId/reactions", authenticate, createReaction)
  router.get("/post/:postId/reactions", authenticate, getReactionsByPostId)
  router.post("/:communityId/members", authenticate, addMemberOnTheCommunity)

  return router
}
