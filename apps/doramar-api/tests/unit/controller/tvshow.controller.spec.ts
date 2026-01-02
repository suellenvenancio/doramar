import { NextFunction, Response, Request } from "express"
import tvshowService from "../../../src/services/tvshows.service"
import { getAllTvShows } from "../../../src/controller/tvShows.controller"

describe("TV Shows Controller", () => {
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

  describe("getAllTVShows", () => {
    it("should fetch all TV shows and return a 200 status", async () => {
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
          genres: [
            { id: "1", name: "SCI-FI" },
            { id: "2", name: "Romance" },
          ],
          actors: [],
        },
      ]

      jest
        .spyOn(tvshowService, "getAllTvShows")
        .mockResolvedValueOnce(mockTvShows)

      await getAllTvShows(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "TV shows retrieved successfully!",
        data: mockTvShows,
      })
    })
  })
})
