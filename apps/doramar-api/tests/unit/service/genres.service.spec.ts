import genresServices from "../../../src/services/genres.service"
import genresRepository from "../../../src/repository/genres.repository"

describe("Genres Service", () => {
  describe("getAllGenres", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should return all genres", async () => {
      const mockGenres = [
        { id: "1", name: "Romance" },
        { id: "2", name: "Action" },
      ]

      jest
        .spyOn(genresRepository, "getAllGenres")
        .mockResolvedValueOnce(mockGenres)

      const genres = await genresServices.getAllGenres()

      expect(genresRepository.getAllGenres).toHaveBeenCalledTimes(1)
      expect(genres).toEqual(mockGenres)
    })
  })
})
