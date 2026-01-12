import communitiesRepository from "../../../src/repository/communities.repository"
import communitiesService from "../../../src/services/communities.service"

jest.spyOn(console, "error").mockImplementation(() => {})

describe("Communities Service", () => {
  describe("deleteComment", () => {
    it("should throw an error if comment is not found", async () => {
      const commentId = "comment123"
      const postId = "post123"
      const communityId = "community123"

      const findCommentByIdSpy = jest
        .spyOn(communitiesRepository, "findCommentById")
        .mockResolvedValue(null)

      await expect(
        communitiesService.deleteComment(commentId, postId, communityId),
      ).rejects.toThrow("Comment not found!")

      expect(findCommentByIdSpy).toHaveBeenCalledWith(commentId)
    })

    it("should throw an error if post is not found", async () => {
      const commentId = "comment123"
      const postId = "post123"
      const communityId = "community123"
      const findCommentByIdSpy = jest
        .spyOn(communitiesRepository, "findCommentById")
        .mockResolvedValue({ id: commentId } as any)

      const findPostByIdSpy = jest
        .spyOn(communitiesRepository, "findPostById")
        .mockResolvedValue(null)

      await expect(
        communitiesService.deleteComment(commentId, postId, communityId),
      ).rejects.toThrow("Post not found!")

      expect(findCommentByIdSpy).toHaveBeenCalledWith(commentId)
      expect(findPostByIdSpy).toHaveBeenCalledWith(postId)
    })

    it("should throw an error if community is not found", async () => {
      const commentId = "comment123"
      const postId = "post123"
      const communityId = "community123"

      const findCommentByIdSpy = jest
        .spyOn(communitiesRepository, "findCommentById")
        .mockResolvedValue({ id: commentId } as any)

      const findPostByIdSpy = jest
        .spyOn(communitiesRepository, "findPostById")
        .mockResolvedValue({
          id: postId,
          comments: [
            { id: "comment123", content: "test content" },
            { id: "comment12", content: "test content 1" },
          ],
        } as any)

      const findCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "findCommunityById")
        .mockResolvedValue(null)

      await expect(
        communitiesService.deleteComment(commentId, postId, communityId),
      ).rejects.toThrow("Community not found!")

      expect(findCommentByIdSpy).toHaveBeenCalledWith(commentId)
      expect(findPostByIdSpy).toHaveBeenCalledWith(postId)
      expect(findCommunityByIdSpy).toHaveBeenCalledWith(communityId)
    })

    it("should throw an error if post does not belong to community", async () => {
      const commentId = "comment123"
      const postId = "post123"
      const communityId = "community123"
      const findCommentByIdSpy = jest
        .spyOn(communitiesRepository, "findCommentById")
        .mockResolvedValue({ id: commentId } as any)

      const findPostByIdSpy = jest
        .spyOn(communitiesRepository, "findPostById")
        .mockResolvedValue({
          id: postId,
          comments: [{ id: commentId, content: "test content" }],
        } as any)

      const findCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "findCommunityById")
        .mockResolvedValue({
          id: communityId,
          posts: [{ id: "otherPostId" }],
        } as any)

      await expect(
        communitiesService.deleteComment(commentId, postId, communityId),
      ).rejects.toThrow("Post dont belong to this community!")

      expect(findCommentByIdSpy).toHaveBeenCalledWith(commentId)
      expect(findPostByIdSpy).toHaveBeenCalledWith(postId)
      expect(findCommunityByIdSpy).toHaveBeenCalledWith(communityId)
    })

    it("should throw an error if comment does not belong to post", async () => {
      const commentId = "comment123"
      const postId = "post123"
      const communityId = "community123"

      const findCommentByIdSpy = jest
        .spyOn(communitiesRepository, "findCommentById")
        .mockResolvedValue({ id: commentId } as any)

      jest.spyOn(communitiesRepository, "findPostById").mockResolvedValue({
        id: postId,
        comments: [{ id: "commentId", content: "test content" }],
      } as any)

      jest.spyOn(communitiesRepository, "findCommunityById").mockResolvedValue({
        id: communityId,
        posts: [{ id: postId }],
      } as any)

      await expect(
        communitiesService.deleteComment(commentId, postId, communityId),
      ).rejects.toThrow("Comment dont belong to this post!")
    })

    it("should delete a comment successfully", async () => {
      const commentId = "comment123"
      const postId = "post123"
      const communityId = "community123"

      const findCommentByIdSpy = jest
        .spyOn(communitiesRepository, "findCommentById")
        .mockResolvedValue({ id: commentId } as any)

      const findPostByIdSpy = jest
        .spyOn(communitiesRepository, "findPostById")
        .mockResolvedValue({ id: postId, comments: [{ id: commentId }] } as any)

      const findCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "findCommunityById")
        .mockResolvedValue({
          id: communityId,
          posts: [{ id: postId }],
        } as any)

      const deleteCommentByIdSpy = jest
        .spyOn(communitiesRepository, "deleteCommentById")
        .mockResolvedValue({} as any)

      await expect(
        communitiesService.deleteComment(commentId, postId, communityId),
      ).resolves.not.toThrow()

      expect(findCommentByIdSpy).toHaveBeenCalledWith(commentId)
      expect(findPostByIdSpy).toHaveBeenCalledWith(postId)
      expect(findCommunityByIdSpy).toHaveBeenCalledWith(communityId)
      expect(deleteCommentByIdSpy).toHaveBeenCalledWith(commentId)
    })
  })

  describe("deletePost", () => {
    it("should throw an error if post is not found", async () => {
      const postId = "post123"
      const communityId = "community123"

      const findPostByIdSpy = jest
        .spyOn(communitiesRepository, "findPostById")
        .mockResolvedValue(null)

      await expect(
        communitiesService.deletePost(postId, communityId),
      ).rejects.toThrow("Post not found!")

      expect(findPostByIdSpy).toHaveBeenCalledWith(postId)
    })

    it("should throw an error if community is not found", async () => {
      const postId = "post123"
      const communityId = "community123"
      const findPostByIdSpy = jest
        .spyOn(communitiesRepository, "findPostById")
        .mockResolvedValue({ id: postId } as any)

      const findCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "findCommunityById")
        .mockResolvedValue(null)

      await expect(
        communitiesService.deletePost(postId, communityId),
      ).rejects.toThrow("Community not found!")

      expect(findPostByIdSpy).toHaveBeenCalledWith(postId)
      expect(findCommunityByIdSpy).toHaveBeenCalledWith(communityId)
    })
    it("should throw an error if post does not belong to community", async () => {
      const postId = "post123"
      const communityId = "community123"
      const findPostByIdSpy = jest
        .spyOn(communitiesRepository, "findPostById")
        .mockResolvedValue({ id: postId } as any)

      const findCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "findCommunityById")
        .mockResolvedValue({
          id: communityId,
          posts: [{ id: "otherPostId" }],
        } as any)

      await expect(
        communitiesService.deletePost(postId, communityId),
      ).rejects.toThrow("Post dont belong to this community!")

      expect(findPostByIdSpy).toHaveBeenCalledWith(postId)
      expect(findCommunityByIdSpy).toHaveBeenCalledWith(communityId)
    })

    it("should delete a post successfully", async () => {
      const postId = "post123"
      const communityId = "community123"

      const findPostByIdSpy = jest
        .spyOn(communitiesRepository, "findPostById")
        .mockResolvedValue({ id: postId } as any)

      const findCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "findCommunityById")
        .mockResolvedValue({
          id: communityId,
          posts: [{ id: postId }],
        } as any)

      const deletePostByIdSpy = jest
        .spyOn(communitiesRepository, "deletePostById")
        .mockResolvedValue({} as any)

      await expect(
        communitiesService.deletePost(postId, communityId),
      ).resolves.not.toThrow()

      expect(findPostByIdSpy).toHaveBeenCalledWith(postId)
      expect(findCommunityByIdSpy).toHaveBeenCalledWith(communityId)
      expect(deletePostByIdSpy).toHaveBeenCalledWith(postId)
    })
  })

  describe("deleteCommunity", () => {
    it("should throw an error if community is not found", async () => {
      const communityId = "community123"

      const findCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "findCommunityById")
        .mockResolvedValue(null)

      await expect(
        communitiesService.deleteCommunity(communityId),
      ).rejects.toThrow("Community not found!")

      expect(findCommunityByIdSpy).toHaveBeenCalledWith(communityId)
    })

    it("should delete a community successfully", async () => {
      const communityId = "community123"

      const findCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "findCommunityById")
        .mockResolvedValue({ id: communityId } as any)

      const deleteCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "deleteCommunityById")
        .mockResolvedValue({} as any)

      await expect(
        communitiesService.deleteCommunity(communityId),
      ).resolves.not.toThrow()
      expect(deleteCommunityByIdSpy).toHaveBeenCalledWith(communityId)
      expect(findCommunityByIdSpy).toHaveBeenCalledWith(communityId)
    })
  })

  describe("uploadCommunityProfilePicture", () => {
    it("should throw an error if community is not found", async () => {
      const communityId = "community123"
      const imageBuffer = Buffer.from("fake image data") as any

      const findCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "findCommunityById")
        .mockResolvedValue(null)

      await expect(
        communitiesService.uploadCommunityProfilePicture(
          communityId,
          imageBuffer,
        ),
      ).rejects.toThrow("Community not found!")

      expect(findCommunityByIdSpy).toHaveBeenCalledWith(communityId)
    })
    it("should upload community profile picture successfully", async () => {
      const communityId = "community123"
      const imageBuffer = Buffer.from("fake image data") as any

      const findCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "findCommunityById")
        .mockResolvedValue({ id: communityId } as any)

      const updateCommunityProfilePictureSpy = jest
        .spyOn(communitiesRepository, "updateCommunityProfilePicture")
        .mockResolvedValue({} as any)

      await expect(
        communitiesService.uploadCommunityProfilePicture(
          communityId,
          imageBuffer,
        ),
      ).resolves.not.toThrow()

      expect(findCommunityByIdSpy).toHaveBeenCalledWith(communityId)
    })
  })

  describe("uploadCommunityCoverImage", () => {
    it("should throw an error if community is not found", async () => {
      const communityId = "community123"
      const imageBuffer = Buffer.from("fake image data") as any

      const findCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "findCommunityById")
        .mockResolvedValue(null)

      await expect(
        communitiesService.uploadCommunityCoverPicture(
          communityId,
          imageBuffer,
        ),
      ).rejects.toThrow("Community not found!")
      expect(findCommunityByIdSpy).toHaveBeenCalledWith(communityId)
    })

    it("should upload community cover image successfully", async () => {
      const communityId = "community123"
      const imageBuffer = Buffer.from("fake image data") as any

      const findCommunityByIdSpy = jest
        .spyOn(communitiesRepository, "findCommunityById")
        .mockResolvedValue({ id: communityId } as any)

      jest
        .spyOn(communitiesRepository, "updateCommunityCoverPicture")
        .mockResolvedValue({} as any)

      await expect(
        communitiesService.uploadCommunityCoverPicture(
          communityId,
          imageBuffer,
        ),
      ).resolves.not.toThrow()

      expect(findCommunityByIdSpy).toHaveBeenCalledWith(communityId)
    })
  })
})
