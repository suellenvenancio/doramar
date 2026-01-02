import actorsService from "../../../src/services/actors.service"
import actorsRepository from "../../../src/repository/actors.repository"

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
})
