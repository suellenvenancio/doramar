import { NextFunction, Request, Response } from "express"
import userService from "../../../src/services/user.service"
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  updateUser,
} from "../../../src/controller/users.controller"
import { AppError } from "../../../src/utils/errors"

jest.spyOn(console, "error").mockImplementation(() => {})

describe("User Controller", () => {
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

  describe("createUser", () => {
    it("should not create an user if email is already in use", async () => {
      const userData = {
        name: "Test User",
        email: "test@test.com",
        password: "password123",
        username: "testuser",
      }

      mockRequest.body = userData

      jest
        .spyOn(userService, "createUser")
        .mockRejectedValueOnce(new AppError("Email already in use!", 409))

      await createUser(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "Email already in use!",
        statusCode: 409,
        data: undefined,
      })
    })
    it("should not create an user if username is already in use", async () => {
      const userData = {
        name: "Test User",
        email: "test@test.com",
        password: "password123",
        username: "testuser",
      }

      mockRequest.body = userData

      jest
        .spyOn(userService, "createUser")
        .mockRejectedValueOnce(new AppError("Username already in use!", 409))

      await createUser(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "Username already in use!",
        statusCode: 409,
        data: undefined,
      })
    })

    it("should create a user successfully", async () => {
      const userData = {
        name: "Test User",
        email: "test@test.com",
        username: "testuser",
      }

      mockRequest.body = userData

      const mockUser = {
        id: "1",
        name: "Test User",
        email: "test@test.com",
        username: "testuser",
        profilePicture: "https://",
      }

      jest.spyOn(userService, "createUser").mockResolvedValueOnce({
        ...mockUser,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      })

      await createUser(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(userService.createUser).toHaveBeenCalledWith(userData)
      expect(mockResponse.status).toHaveBeenCalledWith(201)
    })
  })

  describe("getUserById", () => {
    it("should throw an error if user not found", async () => {
      const userId = "1"
      mockRequest.params = { userId }
      const user = {
        id: "1",
        name: "Test User",
        email: "test@test.com",
        username: "testuser",
        password: "hash",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      }

      jest
        .spyOn(userService, "findUserById")
        .mockRejectedValueOnce(new AppError("Email not found!", 404))

      await findUserById(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )
      expect(userService.findUserById).toHaveBeenCalledWith(userId)
      expect(mockResponse.status).toHaveBeenCalledWith(404)
    })
    it("should get user by id successfully", async () => {
      const userId = "1"
      mockRequest.params = { userId }
      const user = {
        id: "1",
        name: "Test User",
        email: "test@test.com",
        username: "testuser",
        password: "hash",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
        profilePicture: "https://",
      }

      jest.spyOn(userService, "findUserById").mockResolvedValueOnce({
        ...user,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      })

      await findUserById(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )
      expect(userService.findUserById).toHaveBeenCalledWith(userId)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
    })
  })

  describe("getUserByEmail", () => {
    it("should throw an error if user not found by email", async () => {
      const user = {
        id: "1",
        name: "Test User",
        email: "testinho@test.com",
        username: "testuser",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      }

      const email = "testinho@test.com"
      mockRequest.query = { email }

      jest
        .spyOn(userService, "findUserByEmail")
        .mockRejectedValueOnce(new AppError("User not found!", 404))

      await findUserByEmail(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(userService.findUserByEmail).toHaveBeenCalledWith(email)
      expect(mockResponse.status).toHaveBeenCalledWith(404)
    })
    it("should get user by email successfully", async () => {
      const user = {
        id: "1",
        name: "Test User",
        email: "testinho@test.com",
        username: "testuser",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
        profilePicture: "https://",
      }

      const email = "testinho@test.com"
      mockRequest.query = { email }

      jest.spyOn(userService, "findUserByEmail").mockResolvedValueOnce({
        ...user,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      })

      await findUserByEmail(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(userService.findUserByEmail).toHaveBeenCalledWith(email)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
    })
  })

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const userId = "1"
      const userData = {
        name: "Updated User",
        email: "updated@test.com",
        username: "updateduser",
      }

      mockRequest.params = { userId }
      mockRequest.body = userData

      jest.spyOn(userService, "updateUser").mockResolvedValueOnce({
        id: userId,
        ...userData,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      } as any)

      await updateUser(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(userService.updateUser).toHaveBeenCalledWith(userId, userData)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
    })
  })

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      const userId = "1"
      mockRequest.params = { userId }

      jest.spyOn(userService, "deleteUser").mockResolvedValueOnce()

      await deleteUserById(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(userService.deleteUser).toHaveBeenCalledWith(userId)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
    })
  })
})
