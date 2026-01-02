import ratingsService from "../../../src/services/ratings.service"
import ratingsRepository from "../../../src/repository/ratings.repository"
import tvShowRepository from "../../../src/repository/tvshow.repository"
import { de } from "zod/v4/locales"

describe("Ratings service", () => {
  describe("createRating", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should throw an error if TV Show is not found", async () => {
      const mockRatingData = {
        userId: "user123",
        tvShowId: "tvshow123",
        scaleId: 5,
      }

      const mockCreatedRating = {
        userId: "user123",
        comment: null,
        tvShowId: "tvshow123",
        scaleId: 5,
        id: "rating123",
        tvShow: {
          id: "tvshow123",
          title: "Sample TV Show",
          synopsis: "This is a sample synopsis.",
          poster: "http://example.com/poster.jpg",
          premiereDate: new Date("2024-01-01"),
          originalName: "Original Sample TV Show",
          createdAt: new Date("2024-01-01"),
        },
        scale: {
          id: 5,
          label: "Amei",
        },
      }

      jest
        .spyOn(ratingsRepository, "createRating")
        .mockResolvedValueOnce(mockCreatedRating)
      jest.spyOn(tvShowRepository, "findTvShowById").mockResolvedValueOnce(null)

      await expect(ratingsService.createRating(mockRatingData)).rejects.toThrow(
        "TV Show not found!"
      )
    })

    it("should create and return the new rating", async () => {
      const mockRatingData = {
        userId: "user123",
        tvShowId: "tvshow123",
        scaleId: 5,
      }

      const mockCreatedRating = {
        userId: "user123",
        comment: null,
        tvShowId: "tvshow123",
        scaleId: 5,
        id: "rating123",
        tvShow: {
          id: "tvshow123",
          title: "Sample TV Show",
          synopsis: "This is a sample synopsis.",
          poster: "http://example.com/poster.jpg",
          premiereDate: new Date("2024-01-01"),
          originalName: "Original Sample TV Show",
          createdAt: new Date("2024-01-01"),
        },
        scale: {
          id: 5,
          label: "Amei",
        },
      }
      jest.spyOn(tvShowRepository, "findTvShowById").mockResolvedValueOnce({
        id: "tvshow123",
        title: "Sample TV Show",
        synopsis: "This is a sample synopsis.",
        poster: "http://example.com/poster.jpg",
        premiereDate: new Date("2024-01-01"),
        originalName: "Original Sample TV Show",
        createdAt: new Date("2024-01-01"),
      })
      jest
        .spyOn(ratingsRepository, "createRating")
        .mockResolvedValueOnce(mockCreatedRating)
      jest
        .spyOn(ratingsRepository, "getRatingByUserIdAndTvShowId")
        .mockResolvedValueOnce(null)
      jest
        .spyOn(ratingsRepository, "getRatingByUserIdAndTvShowId")
        .mockResolvedValueOnce(null)

      const createdRating = await ratingsService.createRating(mockRatingData)

      expect(ratingsRepository.createRating).toHaveBeenCalledWith(
        mockRatingData
      )
      expect(createdRating).toEqual(mockCreatedRating)
    })
  })

  describe("getRatingsByUserId", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should return ratings for the given user ID", async () => {
      const mockUserId = "user123"
      const mockRatings = [
        {
          id: "rating1",
          userId: mockUserId,
          tvShowId: "tvshow1",
          scaleId: 4,
          comment: "Great show!",
          user: {
            name: "Test User",
            email: "testuser@example.com",
            id: mockUserId,
            username: "testuser",
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
          },
          tvShow: {
            id: "tvshow1",
            title: "Sample TV Show 1",
            synopsis: "This is a sample synopsis for TV Show 1.",
            poster: "http://example.com/poster1.jpg",
            premiereDate: new Date("2024-01-01"),
            originalName: "Original Sample TV Show 1",
            createdAt: new Date("2024-01-01"),
          },
          scale: {
            id: 4,
            label: "muito bom",
          },
        },
        {
          id: "rating2",
          userId: mockUserId,
          tvShowId: "tvshow2",
          scaleId: 5,
          comment: "Loved it!",
          user: {
            name: "Test User",
            email: "testuser@example.com",
            id: mockUserId,
            username: "testuser",
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
          },
          tvShow: {
            id: "tvshow2",
            title: "Sample TV Show 2",
            synopsis: "This is a sample synopsis for TV Show 2.",
            poster: "http://example.com/poster2.jpg",
            premiereDate: new Date("2024-02-01"),
            originalName: "Original Sample TV Show 2",
            createdAt: new Date("2024-02-01"),
          },
          scale: {
            id: 5,
            label: "Amei",
          },
        },
      ]

      jest
        .spyOn(ratingsRepository, "getRatingsByUserId")
        .mockResolvedValueOnce(mockRatings)

      const ratings = await ratingsService.getRatingsByUserId(mockUserId)

      expect(ratingsRepository.getRatingsByUserId).toHaveBeenCalledWith(
        mockUserId
      )
      expect(ratings).toEqual(mockRatings)
    })
  })

  describe("getRatingScales", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should return all rating scales", async () => {
      const mockRatingScales = [
        { id: 1, label: "Péssimo" },
        { id: 2, label: "Entediante" },
        { id: 3, label: "Mediano" },
        { id: 4, label: "Muito bom" },
        { id: 5, label: "Amei" },
      ]
      jest
        .spyOn(ratingsRepository, "getRatingScales")
        .mockResolvedValueOnce(mockRatingScales)

      const ratingScales = await ratingsService.getRatingScales()

      expect(ratingsRepository.getRatingScales).toHaveBeenCalledTimes(1)
      expect(ratingScales).toEqual(mockRatingScales)
    })
  })

  describe("getRatingById", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should return the rating for the given rating ID", async () => {
      const mockRatingId = "rating123"
      const mockRating = {
        id: mockRatingId,
        userId: "user123",
        tvShowId: "tvshow123",
        scaleId: 5,
        comment: "Loved it!",
        user: {
          name: "Test User",
          email: "testuser@example.com",
          id: "user123",
          username: "testuser",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
        tvShow: {
          id: "tvshow123",
          title: "Sample TV Show",
          synopsis: "This is a sample synopsis.",
          poster: "http://example.com/poster.jpg",
          premiereDate: new Date("2024-01-01"),
          originalName: "Original Sample TV Show",
          createdAt: new Date("2024-01-01"),
        },
        scale: {
          id: 5,
          label: "Amei",
        },
      }

      jest
        .spyOn(ratingsRepository, "getRatingById")
        .mockResolvedValueOnce(mockRating)

      const rating = await ratingsService.getRatingById(mockRatingId)

      expect(ratingsRepository.getRatingById).toHaveBeenCalledWith(mockRatingId)
      expect(rating).toEqual(mockRating)
    })
  })

  describe("createRatingScale", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should create and return the new rating scale", async () => {
      const mockScaleData = { id: 6, label: "Excelente" }
      const mockCreatedScale = { id: 6, label: "Excelente" }

      jest
        .spyOn(ratingsRepository, "createRatingScale")
        .mockResolvedValueOnce(mockCreatedScale)

      const createdScale = await ratingsService.createRatingScale(mockScaleData)

      expect(ratingsRepository.createRatingScale).toHaveBeenCalledWith(
        mockScaleData.id,
        mockScaleData.label
      )
      expect(createdScale).toEqual(mockCreatedScale)
    })
  })
})
