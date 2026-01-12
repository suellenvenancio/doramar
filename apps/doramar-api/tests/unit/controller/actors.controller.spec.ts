import { NextFunction, Response, Request } from "express"
import {
  findFavoriteActorsByUserId,
  getAllActors,
} from "../../../src/controller/actors.controller"
import actorsService from "../../../src/services/actors.service"
import { AppError } from "../../../src/utils/errors"

jest.spyOn(console, "error").mockImplementation(() => {})

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
        nextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "Actors retrieved successfully!",
        data: actorsArray,
      })
    })
  })

  describe("findFavoriteActorsByUserId", () => {
    it("should thrown if user does not exist", async () => {
      mockRequest.params = { userId: "nonexistent-user-id" }

      jest
        .spyOn(actorsService, "findFavoriteActorsByUserId")
        .mockRejectedValueOnce(new AppError("User not found!", 404))

      await findFavoriteActorsByUserId(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User not found!",
        statusCode: 404,
        data: undefined,
      })
    })
  })

  describe("findFavoriteActorsByUserId", () => {
    it("should thrown if user does not exist", async () => {
      mockRequest.params = { userId: "nonexistent-user-id" }

      jest
        .spyOn(actorsService, "findFavoriteActorsByUserId")
        .mockRejectedValueOnce(new AppError("User not found!", 404))

      await findFavoriteActorsByUserId(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User not found!",
        statusCode: 404,
        data: undefined,
      })
    })

    it("should return favorite actors", async () => {
      mockRequest.params = { userId: "existent-user-id" }
      const actorsArray = [
        { id: "1", name: "Actor One", image: "" },
        { id: "2", name: "Actor Two", image: "" },
      ]
      jest
        .spyOn(actorsService, "findFavoriteActorsByUserId")
        .mockResolvedValueOnce(actorsArray)

      await findFavoriteActorsByUserId(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Favorite actors retrieved successfully!",
        statusCode: 200,
        data: actorsArray,
      })
    })
  })
})
