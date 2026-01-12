import actorsService from "../../../src/services/actors.service"
import actorsRepository from "../../../src/repository/actors.repository"
import { AppError } from "../../../src/utils/errors"

describe("Actors Service", () => {
  describe("getAllActors", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should return all actors", async () => {
      const mockActors = [
        { id: "1", name: "Actor One", image: "" },
        { id: "2", name: "Actor Two", image: "" },
      ]

      jest
        .spyOn(actorsRepository, "getAllActors")
        .mockResolvedValueOnce(mockActors)

      const actors = await actorsService.getAllActors()

      expect(actorsRepository.getAllActors).toHaveBeenCalledTimes(1)
      expect(actors).toEqual(mockActors)
    })
  })

  describe("findFavoriteActorsByUserId", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should throw error when user does not exist", async () => {
      const mockUserId = "nonexistent-user-id"

      jest
        .spyOn(actorsRepository, "findFavoriteActorsByUserId")
        .mockRejectedValueOnce(new AppError("User not found!", 404))

      await expect(
        actorsService.findFavoriteActorsByUserId(mockUserId),
      ).rejects.toThrow("User not found!")
    })

    it("should return favorite actors by user id", async () => {
      const mockUserId = "user-123"
      const mockFavoriteActors = [
        {
          id: "1",
          userId: "user-123",
          actorId: "actor-1",
          actor: { id: "1", name: "Actor One", image: "" },
        },
        {
          id: "2",
          userId: "user-123",
          actorId: "actor-2",
          actor: { id: "2", name: "Actor Two", image: "" },
        },
      ]

      jest
        .spyOn(actorsRepository, "findFavoriteActorsByUserId")
        .mockResolvedValueOnce(mockFavoriteActors)

      const favoriteActors =
        await actorsService.findFavoriteActorsByUserId(mockUserId)

      expect(actorsRepository.findFavoriteActorsByUserId).toHaveBeenCalledWith(
        mockUserId,
      )
      expect(favoriteActors).toEqual(mockFavoriteActors)
    })
  })
})
