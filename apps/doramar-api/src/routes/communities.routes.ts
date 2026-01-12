import express from "express"
import { authenticate } from "../middleware"
import {
  addMemberOnTheCommunity,
  createComment,
  createCommunity,
  createPost,
  createReaction,
  deleteComment,
  deleteCommunity,
  deletePost,
  getAllCommunities,
  getPostComments,
  getPostsByCommunityId,
  getReactionsByPostId,
  uploadCommunityCoverPicture,
  uploadCommunityProfilePicture,
} from "../controller/communities.controller"
import { upload } from "@/middleware/upload"

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
  router.patch(
    "/:communityId/avatar",
    upload.single("file"),
    authenticate,
    uploadCommunityProfilePicture,
  )
  router.patch(
    "/:communityId/cover",
    upload.single("file"),
    authenticate,
    uploadCommunityCoverPicture,
  )
  router.delete(
    "/:communityId/post/:postId/comments/:commentId",
    authenticate,
    deleteComment,
  )
  router.delete("/:communityId/post/:postId", authenticate, deletePost)
  router.delete("/:communityId", authenticate, deleteCommunity)

  return router
}
