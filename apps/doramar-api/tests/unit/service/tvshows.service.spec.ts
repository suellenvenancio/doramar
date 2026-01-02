import tvshowsService from "../../../src/services/tvshows.service"
import tvshowsRepository from "../../../src/repository/tvshow.repository"

describe("TV Shows service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe("getAllTvShows", () => {
    it("should return all tv shows", async () => {
      const mockTvShows = [
        {
          id: "1",
          title: "TV Show One",
          synopsis: "This is the synopsis for TV Show One.",
          cast: "Actor A, Actor B",
          poster: "http://example.com/poster.jpg",
          premiereDate: new Date("2024-01-01"),
          originalName: "Original TV Show One",
          createdAt: new Date("2024-01-01"),
          genres: [
            { id: "1", name: "Drama" },
            { id: "2", name: "Romance" },
          ],
          actors: [],
          tvshowGenres: [
            {
              id: "2",
              tvShowId: "numero 1",
              genreId: "1",
              genre: { id: "1", name: "Drama" },
            },
            {
              id: "3",
              tvShowId: "numero 1",
              genreId: "1",
              genre: { id: "2", name: "Romance" },
            },
          ],
        },
        {
          id: "2",
          title: "TV Show Two",
          synopsis: "This is the synopsis for TV Show Two.",
          cast: "Actor C, Actor D",
          poster: "http://example.com/poster2.jpg",
          premiereDate: new Date("2024-01-02"),
          originalName: "Original TV Show Two",
          createdAt: new Date("2024-01-02"),
          tvshowGenres: [
            {
              id: "3",
              tvShowId: "2",
              genreId: "1",
              genre: { id: "1", name: "SCI-FI" },
            },
            {
              id: "4",
              tvShowId: "2",
              genreId: "1",
              genre: { id: "2", name: "Romance" },
            },
          ],
          genres: [
            { id: "1", name: "SCI-FI" },
            { id: "2", name: "Romance" },
          ],
          actors: [],
        },
      ]

      jest
        .spyOn(tvshowsRepository, "getAllTvShows")
        .mockResolvedValueOnce(mockTvShows)

      const tvshows = await tvshowsService.getAllTvShows()

      expect(tvshowsRepository.getAllTvShows).toHaveBeenCalledTimes(1)
      expect(tvshows).toEqual(mockTvShows)
    })
  })
})
