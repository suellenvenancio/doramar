import { NextFunction, Request, Response } from "express"
import listsService from "../../../src/services/list.service"
import { AppError } from "../../../src/utils/errors"
import {
  addTvShowToList,
  createList,
  getListsByUserEmail,
  getListsByUserId,
  updateListOrder,
} from "../../../src/controller/lists.controller"

jest.spyOn(console, "error").mockImplementation(() => {})
describe("User Controller", () => {
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

  describe("updateListOrder", () => {
    it("should not update list if the list does not exist", async () => {
      const listId = "nonexistent-list-id"
      const updateData = {
        order: 2,
      }

      mockRequest.params = { listId }
      mockRequest.body = updateData

      jest
        .spyOn(listsService, "updateListOrder")
        .mockRejectedValueOnce(new AppError("List not found!", 404))

      await updateListOrder(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "List not found!",
        statusCode: 404,
        data: undefined,
      })
    })

    it("should not update list if the list has no items", async () => {
      const listId = "list-without-items"
      const updateData = {
        order: 1,
      }

      mockRequest.params = { listId }
      mockRequest.body = updateData

      jest
        .spyOn(listsService, "updateListOrder")
        .mockRejectedValueOnce(
          new AppError("List has no items to reorder!", 400)
        )

      await updateListOrder(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "List has no items to reorder!",
        statusCode: 400,
        data: undefined,
      })
    })

    it("it should not update if tv show does not exist  ", async () => {
      const listId = "valid-list-id"
      const updateData = {
        order: 1,
        tvShowId: "nonexistent-tvshow-id",
      }

      mockRequest.params = { listId }
      mockRequest.body = updateData
      jest
        .spyOn(listsService, "updateListOrder")
        .mockRejectedValueOnce(
          new AppError("TV Show not found in the list!", 404)
        )

      await updateListOrder(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "TV Show not found in the list!",
        statusCode: 404,
        data: undefined,
      })
    })

    it("should not update list if the tv show is not found in the list", async () => {
      const listId = "valid-list-id"
      const updateData = {
        order: 1,
        tvShowId: "nonexistent-tvshow-id",
      }

      mockRequest.params = { listId }
      mockRequest.body = updateData

      jest
        .spyOn(listsService, "updateListOrder")
        .mockRejectedValueOnce(
          new AppError("TV Show not found in the list!", 404)
        )

      await updateListOrder(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "TV Show not found in the list!",
        statusCode: 404,
        data: undefined,
      })
    })

    it("should update list successfully", async () => {
      const listId = "valid-list-id"
      const updateData = {
        order: 2,
        tvShowId: "valid-tvshow-id",
      }

      const mockUpdatedList = {
        id: listId,
        name: "My Updated List",
        tvShows: [
          { id: "valid-tvshow-id", order: 2 },
          { id: "another-tvshow-id", order: 1 },
        ],
      }
      mockRequest.params = { listId }
      mockRequest.body = updateData

      const mockListWithTvShows = {
        id: "list123",
        name: "My List",
        userId: "user123",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        tvShows: [
          {
            id: "item1",
            title: "Test TV Show",
            synopsis: "This is a test TV show.",
            cast: "Actor A, Actor B",
            poster: "http://example.com/poster.jpg",
            premiereDate: new Date("2024-01-01"),
            originalName: "Original Test TV Show",
            createdAt: new Date("2024-01-01"),
            order: 1,
          },
          {
            id: "item3",
            title: "Test TV Show 2",
            synopsis: "This is a test TV show.2",
            cast: "Actor A, Actor B",
            poster: "http://example.com/poster.jpg",
            premiereDate: new Date("2024-01-01"),
            originalName: "Original Test TV Show",
            createdAt: new Date("2024-01-01"),
            order: 2,
          },
          {
            id: "item2",
            title: "Test TV Show 3",
            synopsis: "This is a test TV show.3",
            cast: "Actor A, Actor B",
            poster: "http://example.com/poster.jpg",
            premiereDate: new Date("2024-01-01"),
            originalName: "Original Test TV Show",
            createdAt: new Date("2024-01-01"),
            order: 3,
          },
        ],
      }

      jest
        .spyOn(listsService, "updateListOrder")
        .mockResolvedValueOnce(mockListWithTvShows)

      await updateListOrder(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "List order updated successfully",
        statusCode: 201,
        data: mockListWithTvShows,
      })
    })
  })

  describe("addTvShowToList", () => {
    it("should throw error 404 when list does not exist", async () => {
      const listId = "valid-list-id"
      const tvShowId = "valid-tvshow-id"
      const userId = "user123"

      mockRequest.params = { listId, tvShowId }
      mockRequest.body = { userId }

      jest
        .spyOn(listsService, "addTvShowToList")
        .mockRejectedValueOnce(new AppError("List does not exist!", 404))

      await addTvShowToList(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "List does not exist!",
        statusCode: 404,
        data: undefined,
      })
    })
    it("should throw error 403 when user has no permission", async () => {
      const listId = "valid-list-id"
      const tvShowId = "valid-tvshow-id"
      const userId = "user123"

      mockRequest.params = { listId, tvShowId }
      mockRequest.body = { userId }

      jest
        .spyOn(listsService, "addTvShowToList")
        .mockRejectedValueOnce(
          new AppError("You do not have permission to modify this list!", 403)
        )

      await addTvShowToList(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "You do not have permission to modify this list!",
        statusCode: 403,
        data: undefined,
      })
    })

    it("should throw error 404 when tv show does not exist", async () => {
      const listId = "valid-list-id"
      const tvShowId = "valid-tvshow-id"
      const userId = "user123"

      mockRequest.params = { listId, tvShowId }
      mockRequest.body = { userId }

      jest
        .spyOn(listsService, "addTvShowToList")
        .mockRejectedValueOnce(new AppError("TV Show does not exist!", 404))

      await addTvShowToList(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "TV Show does not exist!",
        statusCode: 404,
        data: undefined,
      })
    })

    it("should throw error 400 when tv show already in the list", async () => {
      const listId = "valid-list-id"
      const tvShowId = "valid-tvshow-id"
      const userId = "user123"

      mockRequest.params = { listId, tvShowId }
      mockRequest.body = { userId }

      jest
        .spyOn(listsService, "addTvShowToList")
        .mockRejectedValueOnce(
          new AppError("The TV Show already exists in this list!", 400)
        )

      await addTvShowToList(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "The TV Show already exists in this list!",
        statusCode: 400,
        data: undefined,
      })
    })

    it("should add tv show to list successfully", async () => {
      const listId = "valid-list-id"
      const tvShowId = "valid-tvshow-id"
      const userId = "user123"

      mockRequest.params = { listId, tvShowId }
      mockRequest.body = { userId }

      const returnedListMock = {
        id: "list123",
        name: "My List",
        userId: "user123",
        tvShows: [
          {
            id: "item1",
            title: "Test TV Show",
            synopsis: "This is a test TV show.",
            cast: "Actor A, Actor B",
            poster: "http://example.com/poster.jpg",
            premiereDate: new Date("2024-01-01"),
            originalName: "Original Test TV Show",
            createdAt: new Date("2025-01-01"),
            order: 1,
          },
          {
            id: "item2",
            title: "Test TV Show 2",
            synopsis: "This is a test TV show 2.",
            cast: "Actor C, Actor D",
            poster: "http://example.com/poster2.jpg",
            premiereDate: new Date("2024-02-01"),
            originalName: "Original Test TV Show 2",
            createdAt: new Date("2025-02-01"),
            order: 2,
          },
        ],
      }
      jest
        .spyOn(listsService, "addTvShowToList")
        .mockResolvedValueOnce(returnedListMock)

      await addTvShowToList(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "TV Show Successfully added to the list",
        statusCode: 200,
        data: returnedListMock,
      })
    })
  })

  describe("createList", () => {
    it("should not create list if list with the same name exists for the user", async () => {
      const listData = {
        name: "My Existing List",
        userId: "user123",
      }

      mockRequest.body = listData

      jest
        .spyOn(listsService, "createList")
        .mockRejectedValueOnce(
          new AppError("List with this name already exists for the user!", 400)
        )

      await createList(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "List with this name already exists for the user!",
        statusCode: 400,
        data: undefined,
      })
    })

    it("should create a list successfully", async () => {
      const listData = {
        name: "My New List",
        userId: "user123",
      }

      mockRequest.body = listData

      const createdListMock = {
        id: "list123",
        name: "My New List",
        userId: "user123",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        tvShows: [],
      }

      jest
        .spyOn(listsService, "createList")
        .mockResolvedValueOnce(createdListMock)

      await createList(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "List created successfully!",
        statusCode: 201,
        data: createdListMock,
      })
    })
  })

  describe("getListsByUserId", () => {
    it("should retrieve all lists by user id successfully", async () => {
      const userId = "user123"

      mockRequest.params = { userId }

      const listsMock = [
        {
          id: "list1",
          name: "List One",
          userId: "user123",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          tvShows: [],
        },
        {
          id: "list2",
          name: "List Two",
          userId: "user123",
          createdAt: new Date("2024-02-01"),
          updatedAt: new Date("2024-02-01"),
          tvShows: [],
        },
      ]

      jest
        .spyOn(listsService, "getAllListsByUserId")
        .mockResolvedValueOnce(listsMock)

      await getListsByUserId(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "Lists retrieved successfully",
        statusCode: 200,
        data: listsMock,
      })
    })
  })
  describe("getListsByUserEmail", () => {
    it("should retrieve all lists by user email successfully", async () => {
      const email = "user@example.com"
      mockRequest.query = { email }

      const listsMock = [
        {
          id: "list1",
          name: "List One",
          userId: "user123",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          tvShows: [],
        },
        {
          id: "list2",
          name: "List Two",
          userId: "user123",
          createdAt: new Date("2024-02-01"),
          updatedAt: new Date("2024-02-01"),
          tvShows: [],
        },
      ]

      jest
        .spyOn(listsService, "getAllListsByUserEmail")
        .mockResolvedValueOnce(listsMock)

      await getListsByUserEmail(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse?.json).toHaveBeenCalledWith({
        message: "Lists retrieved successfully",
        statusCode: 200,
        data: listsMock,
      })
    })
  })
})
