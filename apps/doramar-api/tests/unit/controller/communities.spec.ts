import { NextFunction, Request, Response } from "express"
import { AppError } from "../../../src/utils/errors"
import communitiesService from "../../../src/services/communities.service"
import {
  uploadCommunityProfilePicture,
  uploadCommunityCoverPicture,
  deleteCommunity,
  deletePost,
  deleteComment,
} from "../../../src/controller/communities.controller"
import {
  CommunityRole,
  CommunityVisibility,
  MemberStatus,
} from "@prisma/client"

jest.mock("@vercel/blob", () => ({
  put: jest
    .fn()
    .mockResolvedValue({ url: "https://vercel.com/fake-image-url" }),
}))

jest.spyOn(console, "error").mockImplementation(() => {})

describe("CommunitiesController", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction = jest.fn()

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
  })

  describe("uploadCommunityProfilePicture", () => {
    it("should throw an error when no file is uploaded", async () => {
      mockRequest.params = { communityId: "community-id" }
      mockRequest.file = undefined

      await uploadCommunityProfilePicture(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 400,
        message: "No file uploaded!",
        data: undefined,
      })
    })

    it("should throw and error when community does not exists", async () => {
      mockRequest.params = { communityId: "nonexistent-community-id" }
      mockRequest.file = {
        fieldname: "file",
        originalname: "profile-pic.png",
        encoding: "7bit",
        mimetype: "image/png",
        size: 16,
        buffer: Buffer.from("fake-image-data"),
        destination: "",
        filename: "profile-pic.png",
      } as Express.Multer.File

      jest
        .spyOn(communitiesService, "uploadCommunityProfilePicture")
        .mockRejectedValueOnce(new AppError("Community not found!", 404))

      await uploadCommunityProfilePicture(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Community not found!",
        data: undefined,
      })
    })

    it("should return community with new avatarUrl", async () => {
      const communityMock = {
        id: "community-id",
        name: "Test Community",
        description: "Test Description",
        avatarUrl: "https://vercel.com/fake-image-url",
        coverUrl: "https://vercel.com/fake-cover-url",
        visibility: CommunityVisibility.PUBLIC,
        rules: "Test Rules",
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: "owner-id",
        owner: {
          id: "owner-id",
          name: "Owner Name",
          email: "owner@test.com",
          username: "owner",
          profilePicture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        members: [
          {
            id: "member-1",
            communityId: "community-id",
            userId: "user-1",
            role: CommunityRole.ADMIN,
            joinedAt: new Date(),
            status: MemberStatus.APPROVED,
            user: {
              id: "user-1",
              name: "User One",
              email: "",
              username: "userone",
              profilePicture: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      }

      mockRequest.params = { communityId: "nonexistent-community-id" }
      mockRequest.file = {
        fieldname: "file",
        originalname: "profile-pic.png",
        encoding: "7bit",
        mimetype: "image/png",
        size: 16,
        buffer: Buffer.from("fake-image-data"),
        destination: "",
        filename: "profile-pic.png",
      } as Express.Multer.File

      jest
        .spyOn(communitiesService, "uploadCommunityProfilePicture")
        .mockResolvedValueOnce(communityMock)

      await uploadCommunityProfilePicture(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "Community profile picture uploaded successfully!",
        data: communityMock,
      })
    })
  })

  describe("uploadCommunityCoverPicture", () => {
    it("should throw an error when no file is uploaded", async () => {
      mockRequest.params = { communityId: "community-id" }
      mockRequest.file = undefined

      await uploadCommunityCoverPicture(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 400,
        message: "No file uploaded!",
        data: undefined,
      })
    })

    it("should throw and error when community does not exists", async () => {
      mockRequest.params = { communityId: "nonexistent-community-id" }
      mockRequest.file = {
        fieldname: "file",
        originalname: "profile-pic.png",
        encoding: "7bit",
        mimetype: "image/png",
        size: 16,
        buffer: Buffer.from("fake-image-data"),
        destination: "",
        filename: "profile-pic.png",
      } as Express.Multer.File

      jest
        .spyOn(communitiesService, "uploadCommunityCoverPicture")
        .mockRejectedValueOnce(new AppError("Community not found!", 404))

      await uploadCommunityCoverPicture(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Community not found!",
        data: undefined,
      })
    })

    it("should return community with new coverUrl", async () => {
      const communityMock = {
        id: "community-id",
        name: "Test Community",
        description: "Test Description",
        avatarUrl: "https://vercel.com/fake-image-url",
        coverUrl: "https://vercel.com/fake-cover-url",
        visibility: CommunityVisibility.PUBLIC,
        rules: "Test Rules",
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: "owner-id",
        owner: {
          id: "owner-id",
          name: "Owner Name",
          email: "owner@test.com",
          username: "owner",
          profilePicture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        members: [
          {
            id: "member-1",
            communityId: "community-id",
            userId: "user-1",
            role: CommunityRole.ADMIN,
            joinedAt: new Date(),
            status: MemberStatus.APPROVED,
            user: {
              id: "user-1",
              name: "User One",
              email: "",
              username: "userone",
              profilePicture: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      }

      mockRequest.params = { communityId: "nonexistent-community-id" }
      mockRequest.file = {
        fieldname: "file",
        originalname: "profile-pic.png",
        encoding: "7bit",
        mimetype: "image/png",
        size: 16,
        buffer: Buffer.from("fake-image-data"),
        destination: "",
        filename: "profile-pic.png",
      } as Express.Multer.File

      jest
        .spyOn(communitiesService, "uploadCommunityCoverPicture")
        .mockResolvedValueOnce(communityMock)

      await uploadCommunityCoverPicture(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "Community profile picture uploaded successfully!",
        data: communityMock,
      })
    })
  })

  describe("deleteCommunity", () => {
    it("should throw an error when community does not exists", async () => {
      mockRequest.params = { communityId: "nonexistent-community-id" }

      jest
        .spyOn(communitiesService, "deleteCommunity")
        .mockRejectedValueOnce(new AppError("Community not found!", 404))

      await deleteCommunity(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Community not found!",
        data: undefined,
      })
    })

    it("should delete the community successfully", async () => {
      mockRequest.params = { communityId: "community-id" }

      jest.spyOn(communitiesService, "deleteCommunity").mockResolvedValueOnce()

      await deleteCommunity(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "Community deleted successfully!",
        data: undefined,
      })
    })
  })

  describe("deletePost", () => {
    it("should throw an error when post does not exists", async () => {
      mockRequest.params = {
        postId: "nonexistent-post-id",
        communityId: "community-id",
      }

      jest
        .spyOn(communitiesService, "deletePost")
        .mockRejectedValueOnce(new AppError("Post not found!", 404))

      await deletePost(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Post not found!",
        data: undefined,
      })
    })

    it("should thrown a error when community does not exists", async () => {
      mockRequest.params = {
        postId: "post-id",
        communityId: "nonexistent-community-id",
      }

      jest
        .spyOn(communitiesService, "deletePost")
        .mockRejectedValueOnce(new AppError("Community not found!", 404))

      await deletePost(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Community not found!",
        data: undefined,
      })
    })

    it("should thrown a error when post does not belong to the community", async () => {
      mockRequest.params = { postId: "post-id", communityId: "community-id" }

      jest
        .spyOn(communitiesService, "deletePost")
        .mockRejectedValueOnce(
          new AppError("Post dont belong to this community!", 404),
        )

      await deletePost(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Post dont belong to this community!",
        data: undefined,
      })
    })

    it("should delete the post successfully", async () => {
      mockRequest.params = { postId: "post-id" }

      jest.spyOn(communitiesService, "deletePost").mockResolvedValueOnce()

      await deletePost(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "Post deleted successfully!",
        data: undefined,
      })
    })
  })

  describe("deleteComment", () => {
    it("should throw an error when comment does not exists", async () => {
      mockRequest.params = {
        commentId: "nonexistent-comment-id",
        postId: "post-id",
        communityId: "community-id",
      }

      jest
        .spyOn(communitiesService, "deleteComment")
        .mockRejectedValueOnce(new AppError("Comment not found!", 404))

      await deleteComment(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Comment not found!",
        data: undefined,
      })
    })

    it("should thrown a error when post does not exists", async () => {
      mockRequest.params = {
        commentId: "comment-id",
        postId: "nonexistent-post-id",
        communityId: "community-id",
      }

      jest
        .spyOn(communitiesService, "deleteComment")
        .mockRejectedValueOnce(new AppError("Post not found!", 404))

      await deleteComment(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Post not found!",
        data: undefined,
      })
    })

    it("should thrown a error when comment does not belong to the post", async () => {
      mockRequest.params = {
        commentId: "comment-id",
        postId: "post-id",
        communityId: "community-id",
      }

      jest
        .spyOn(communitiesService, "deleteComment")
        .mockRejectedValueOnce(
          new AppError("Comment dont belong to this post!", 404),
        )

      await deleteComment(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Comment dont belong to this post!",
        data: undefined,
      })
    })

    it("should thrown a error when post does not belong to the community", async () => {
      mockRequest.params = {
        commentId: "comment-id",
        postId: "post-id",
        communityId: "community-id",
      }

      jest
        .spyOn(communitiesService, "deleteComment")
        .mockRejectedValueOnce(
          new AppError("Post dont belong to this community!", 404),
        )

      await deleteComment(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 404,
        message: "Post dont belong to this community!",
        data: undefined,
      })
    })

    it("should delete the comment successfully", async () => {
      mockRequest.params = {
        commentId: "comment-id",
        postId: "post-id",
        communityId: "community-id",
      }

      jest.spyOn(communitiesService, "deleteComment").mockResolvedValueOnce()

      await deleteComment(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "Comment deleted successfully!",
        data: undefined,
      })
    })
  })
})
