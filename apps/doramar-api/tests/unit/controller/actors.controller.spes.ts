import { NextFunction, Response, Request } from "express"
import { getAllActors } from "../../../src/controller/actors.controller"
import actorsService from "../../../src/services/actors.service"

describe("Actors Controller", () => {
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

  describe("getAllActors", () => {
    it("should fetch all actors and return a 200 status", async () => {
      const actorsArray = [
        { id: "1", name: "Actor One", image: "" },
        { id: "2", name: "Actor Two", image: "" },
      ]

      jest
        .spyOn(actorsService, "getAllActors")
        .mockResolvedValueOnce(actorsArray)

      await getAllActors(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "Actors retrieved successfully!",
        data: actorsArray,
      })
    })
  })
})
