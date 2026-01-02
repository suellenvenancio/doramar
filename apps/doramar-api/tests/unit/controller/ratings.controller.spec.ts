import { NextFunction, Request, Response } from "express"
import ratingsServices from "../../../src/services/ratings.service"
import {
  createRating,
  getRatingById,
  getRatingsByUserId,
  getRatingScales,
} from "../../../src/controller/ratings.controller"
import { AppError } from "../../../src/utils/errors"

describe("Ratings Controller", () => {
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

  describe("createRating", () => {
    it("should throw an error if TV Show is not found", async () => {
      const ratingData = {
        userId: "user123",
        tvShowId: "tvshow123",
        scaleId: 5,
      }

      mockRequest.body = ratingData

      jest
        .spyOn(ratingsServices, "createRating")
        .mockRejectedValueOnce(new AppError("TV Show not found!", 404))

      await createRating(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "TV Show not found!",
        statusCode: 404,
        data: undefined,
      })
    })

    it("should create the new rating and return 201", async () => {
      const ratingData = {
        userId: "user123",
        tvShowId: "tvshow123",
        scaleId: 5,
      }

      const createdRating = {
        userId: "user123",
        comment: null,
        tvShowId: "tvshow123",
        scaleId: 5,
        id: "rating123",
        tvShow: {
          id: "tvshow123",
          title: "Sample TV Show",
          synopsis: "This is a sample synopsis.",
          cast: "Actor A, Actor B",
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

      mockRequest.body = ratingData

      jest
        .spyOn(ratingsServices, "createRating")
        .mockResolvedValueOnce(createdRating)

      await createRating(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(ratingsServices.createRating).toHaveBeenCalledWith(ratingData)
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "Rating created successfully!",
        statusCode: 201,
        data: createdRating,
      })
    })
  })

  describe("getRatingsByUserId", () => {
    it("should fetch ratings by user id and return 200", async () => {
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
            cast: "Actor A, Actor B",
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
            cast: "Actor C, Actor D",
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

      mockRequest.params = { mockUserId }

      jest
        .spyOn(ratingsServices, "getRatingsByUserId")
        .mockResolvedValueOnce(mockRatings)

      await getRatingsByUserId(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "Ratings fetched successfully",
        statusCode: 200,
        data: mockRatings,
      })
    })
  })

  describe("getRatingScales", () => {
    it("should fetch rating scales and return 200", async () => {
      const mockScales = [
        { id: 1, label: "Péssimo" },
        { id: 2, label: "Entediante" },
        { id: 3, label: "Mediano" },
        { id: 4, label: "Muito bom" },
        { id: 5, label: "Amei" },
      ]

      jest
        .spyOn(ratingsServices, "getRatingScales")
        .mockResolvedValueOnce(mockScales)

      await getRatingScales(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "Rating scales fetched successfully",
        statusCode: 200,
        data: mockScales,
      })
    })
  })

  describe("getRatingById", () => {
    it("should fetch rating by id and return 200", async () => {
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
        },
        tvShow: {
          id: "tvshow123",
          title: "Sample TV Show",
          synopsis: "This is a sample synopsis.",
          cast: "Actor A, Actor B",
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

      mockRequest.params = { ratingId: mockRatingId }

      jest
        .spyOn(ratingsServices, "getRatingById")
        .mockResolvedValueOnce(mockRating)

      await getRatingById(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "Rating fetched successfully",
        statusCode: 200,
        data: mockRating,
      })
    })
  })
})
