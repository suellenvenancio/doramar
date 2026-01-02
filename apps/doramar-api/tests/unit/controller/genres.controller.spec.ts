import { NextFunction, Response, Request } from "express"
import { getAllGenres } from "../../../src/controller/genres.controller"
import genresService from "../../../src/services/genres.service"

describe("Genres Controller", () => {
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

  describe("getAllGenres", () => {
    it("should fetch all genres and return a 200 status", async () => {
      const genresArray = [
        { id: "1", name: "Action" },
        { id: "2", name: "Comedy" },
      ]

      jest
        .spyOn(genresService, "getAllGenres")
        .mockResolvedValueOnce(genresArray)

      await getAllGenres(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "Genres retrieved successfully!",
        data: genresArray,
      })
    })
  })
})
