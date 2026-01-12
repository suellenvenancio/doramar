import { NextFunction, Response, Request } from "express"
import {
  findFavoriteTvShowByUserId,
  getAllTvShows,
  getWatchedStatus,
  markTvShowAsWatched,
} from "../../../src/controller/tvShows.controller"
import tvShowsService from "../../../src/services/tvShows.service"
import { AppError } from "../../../src/utils/errors"

jest.spyOn(console, "error").mockImplementation(() => {})

describe("TvShow Controller", () => {
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

  describe("getAllTvShows", () => {
    it("should fetch all tv shows and return a 200 status", async () => {
      const tvShowsArray = [
        {
          id: "1",
          title: "Show One",
          synopsis: "Synopsis of Show One",
          poster: "url_to_poster_one",
          premiereDate: new Date("2023-02-01"),
          originalName: "Original Show One",
          createdAt: new Date(),
          actors: [],
          genres: [],
          tvshowGenres: [],
        },
        {
          id: "2",
          title: "Show Two",
          synopsis: "Synopsis of Show Two",
          poster: "url_to_poster_two",
          premiereDate: new Date("2023-02-01"),
          originalName: "Original Show Two",
          createdAt: new Date(),
          actors: [],
          genres: [],
          tvshowGenres: [],
        },
      ]

      jest
        .spyOn(tvShowsService, "getAllTvShows")
        .mockResolvedValue(tvShowsArray)

      await getAllTvShows(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "TV shows retrieved successfully!",
        data: tvShowsArray,
      })
    })
  })

  describe("findFavoriteTvShowByUserId", () => {
    it("should fetch favorite tv show by user id and return a 200 status", async () => {
      const favoriteTvShow = {
        id: "1",
        title: "Favorite Show",
        synopsis: "Synopsis of Favorite Show",
        poster: "url_to_favorite_poster",
        premiereDate: new Date("2023-02-01"),
        originalName: "Original Favorite Show",
        createdAt: new Date(),
      }

      mockRequest.params = { userId: "user123" }

      jest
        .spyOn(tvShowsService, "findFavoriteTvShowByUser")
        .mockResolvedValue(favoriteTvShow)

      await findFavoriteTvShowByUserId(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "Favorite TV show retrieved successfully!",
        data: favoriteTvShow,
      })
    })
  })

  describe("getWatchedStatus", () => {
    it("sould return watched statuses with 200 status", async () => {
      const watchedStatuses = [
        { id: 1, label: "Assistindo" },
        { id: 2, label: "Assistido" },
        { id: 3, label: "Abandonei" },
      ]

      jest
        .spyOn(tvShowsService, "watchedStatus")
        .mockResolvedValue(watchedStatuses)

      await getWatchedStatus(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "Watched statuses retrieved successfully",
        data: watchedStatuses,
      })
    })
  })
})
