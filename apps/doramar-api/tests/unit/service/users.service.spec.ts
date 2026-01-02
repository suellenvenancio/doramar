import actorsRepository from "../../../src/repository/actors.repository"
import tvShowRepository from "../../../src/repository/tvshow.repository"
import userRepository from "../../../src/repository/user.repository"
import userService from "../../../src/services/user.service"
import { AppError } from "../../../src/utils/errors"

jest.spyOn(console, "error").mockImplementation(() => {})

describe("User Service", () => {
  describe("updateUser", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })
    it("should throw error when updating to an existing username", async () => {
      const mockId = "123"
      const mockUpdateData = {
        username: "existingusername",
      }
      const mockExistingUser = {
        id: mockId,
        email: "oldemail@test.com",
        username: "username",
        name: "Name",
        createdAt: new Date(),
        updatedAt: new Date(),
        profilePicture: "",
      }

      jest
        .spyOn(userRepository, "findUserById")
        .mockResolvedValueOnce(mockExistingUser)
      jest
        .spyOn(userRepository, "validationUniqueUsername")
        .mockRejectedValueOnce(new AppError("Username already in use", 409))

      await expect(
        userService.updateUser(mockId, mockUpdateData)
      ).rejects.toThrow("Username already in use")
    })

    it("should throw error when updating to an existing email", async () => {
      const mockId = "123"
      const mockUpdateData = {
        email: "existing@test.com",
      }
      const mockExistingUser = {
        id: mockId,
        email: "oldemail@test.com",
        username: "username",
        name: "Name",
        createdAt: new Date(),
        updatedAt: new Date(),
        profilePicture: "",
      }

      jest
        .spyOn(userRepository, "findUserById")
        .mockResolvedValueOnce(mockExistingUser)
      jest
        .spyOn(userRepository, "validationUniqueEmail")
        .mockRejectedValueOnce(new AppError("Email already in use", 409))

      await expect(
        userService.updateUser(mockId, mockUpdateData)
      ).rejects.toThrow("Email already in use")
    })

    it("should throw error when user not found", async () => {
      const mockId = "123"
      const mockUpdateData = {
        name: "New Name",
      }

      jest
        .spyOn(userRepository, "findUserById")
        .mockRejectedValueOnce(new AppError("User not found", 404))

      await expect(
        userService.updateUser(mockId, mockUpdateData)
      ).rejects.toThrow("User not found")
    })

    it("should update user successfully", async () => {
      const mockId = "123"
      const mockUpdateData = {
        name: "New Name",
        username: "newusername",
      }
      const mockUpdatedUser = {
        id: mockId,
        ...mockUpdateData,
        email: "test@test.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        profilePicture: "",
        favoriteActors: [],
        favoriteTvShow: undefined,
      }

      jest
        .spyOn(userRepository, "findUserById")
        .mockResolvedValueOnce({ ...mockUpdatedUser, username: "oldusername" })
      jest
        .spyOn(userRepository, "validationUniqueEmail")
        .mockResolvedValueOnce(true)
      jest
        .spyOn(userRepository, "validationUniqueUsername")
        .mockResolvedValueOnce(true)
      jest
        .spyOn(userRepository, "updateUser")
        .mockResolvedValueOnce(mockUpdatedUser)

      const result = await userService.updateUser(mockId, mockUpdateData)

      expect(userRepository.updateUser).toHaveBeenCalledWith(
        mockId,
        mockUpdateData
      )
      expect(result).toEqual(mockUpdatedUser)
      expect(result.username).toBe(mockUpdateData.username)
    })
  })

  describe("getUserById", () => {
    it("should throw error when user does not exist", async () => {
      const mockId = "123"

      jest
        .spyOn(userRepository, "findUserById")
        .mockRejectedValueOnce(new AppError("User not found!", 404))

      await expect(userService.findUserById(mockId)).rejects.toThrow(
        "User not found"
      )
    })
    it("should return user data when user exists", async () => {
      const mockId = "123"
      const mockUser = {
        id: mockId,
        email: "test@test.com",
        username: "testuser",
        name: "Test User",
        createdAt: new Date(),
        updatedAt: new Date(),
        profilePicture: "",
        favoriteActors: [],
        favoriteTvShow: undefined,
      }

      jest.spyOn(userRepository, "findUserById").mockResolvedValueOnce(mockUser)
      jest
        .spyOn(tvShowRepository, "findFavoriteTvShowByUserId")
        .mockResolvedValueOnce(null)
      jest
        .spyOn(actorsRepository, "findFavoriteActorsByUserId")
        .mockResolvedValueOnce([])
      const result = await userService.findUserById(mockId)

      expect(userRepository.findUserById).toHaveBeenCalledWith(mockId)
      expect(result).toEqual(mockUser)
    })
  })

  describe("getUserByEmail", () => {
    it("should throw error when email does not exist", async () => {
      const mockEmail = "emailwithnouser@test.com"

      jest
        .spyOn(userRepository, "findByEmail")
        .mockRejectedValueOnce(new AppError("Email not found!", 404))

      await expect(userService.findUserByEmail(mockEmail)).rejects.toThrow(
        "Email not found!"
      )
    })

    it("should return user data when email exists", async () => {
      const mockEmail = "existing@test.com"
      const mockUser = {
        id: "123",
        email: mockEmail,
        username: "testuser",
        name: "Test User",
        createdAt: new Date(),
        updatedAt: new Date(),
        profilePicture: "",
        favoriteActors: [],
        favoriteTvShow: undefined,
      }

      jest.spyOn(userRepository, "findByEmail").mockResolvedValueOnce(mockUser)
      jest
        .spyOn(tvShowRepository, "findFavoriteTvShowByUserId")
        .mockResolvedValueOnce(null)
      jest
        .spyOn(actorsRepository, "findFavoriteActorsByUserId")
        .mockResolvedValueOnce([])
      const result = await userService.findUserByEmail(mockEmail)

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail)
      expect(result).toEqual({ ...mockUser })
    })
  })

  describe("createUser", () => {
    it("should throw error when username is already in use", async () => {
      const mockUserData = {
        email: "newemail@test.com",
        username: "existingusername",
        name: "New User",
      }

      jest
        .spyOn(userRepository, "validationUniqueUsername")
        .mockRejectedValueOnce(new AppError("Username already in use!", 409))

      await expect(userService.createUser(mockUserData)).rejects.toThrow(
        "Username already in use!"
      )
    })

    it("should throw error when email is already in use", async () => {
      const mockUserData = {
        email: "existing@test.com",
        username: "newusername",
        name: "New User",
        profilePicture: "",
      }

      jest
        .spyOn(userRepository, "validationUniqueEmail")
        .mockResolvedValueOnce(true)
      jest
        .spyOn(userRepository, "validationUniqueUsername")
        .mockRejectedValueOnce(new AppError("Email already in use!", 409))

      await expect(userService.createUser(mockUserData)).rejects.toThrow(
        "Email already in use!"
      )
    })

    it("should create user successfully", async () => {
      const mockUserData = {
        email: "newuser@test.com",
        username: "newusername",
        name: "New User",
        profilePicture: "",
      }
      const mockCreatedUser = {
        id: "123",
        ...mockUserData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      jest
        .spyOn(userRepository, "validationUniqueEmail")
        .mockResolvedValueOnce(true)
      jest
        .spyOn(userRepository, "validationUniqueUsername")
        .mockResolvedValueOnce(true)

      jest
        .spyOn(userRepository, "createUser")
        .mockResolvedValueOnce(mockCreatedUser)

      const result = await userService.createUser(mockUserData)

      expect(userRepository.createUser).toHaveBeenCalled()
      expect(result).toEqual(mockCreatedUser)
    })
  })

  describe("deleteUser", () => {
    it("should throw error when user does not exist", async () => {
      const mockId = "123"

      jest
        .spyOn(userRepository, "findUserById")
        .mockRejectedValueOnce(new AppError("User not found!", 404))

      await expect(userService.deleteUser(mockId)).rejects.toThrow(
        "User not found!"
      )
    })

    it("should delete user successfully", async () => {
      const mockId = "123"
      const mockUser = {
        id: mockId,
        email: "testuser@test.com",
        username: "testuser",
        name: "Test User",
        createdAt: new Date(),
        updatedAt: new Date(),
        profilePicture: "",
      }

      jest.spyOn(userRepository, "findUserById").mockResolvedValueOnce(mockUser)
      jest.spyOn(userRepository, "deleteUser").mockResolvedValueOnce()

      await userService.deleteUser(mockId)

      expect(userRepository.findUserById).toHaveBeenCalledWith(mockId)
      expect(userRepository.deleteUser).toHaveBeenCalledWith(mockId)
    })
  })
})
