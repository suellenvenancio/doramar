import listsService from "../../../src/services/list.service"
import listsRepository from "../../../src/repository/list.repository"
import tvShowRepository from "../../../src/repository/tvshow.repository"

global.console.error = jest.fn()

describe("List service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("updateListOrder", () => {
    it("should throw an error if the list does not exist", async () => {
      jest
        .spyOn(listsRepository, "findListByIdAndUserId")
        .mockResolvedValueOnce(null)

      await expect(
        listsService.updateListOrder({
          listId: "list123",
          userId: "2",
          tvShows: [
            {
              id: "1",
              title: "TV Show One",
              synopsis: "This is the synopsis for TV Show One.",
              poster: "http://example.com/poster.jpg",
              premiereDate: "2024-01-01",
              originalName: "Original TV Show One",
              createdAt: new Date("2024-01-01"),
            },
            {
              id: "2",
              title: "TV Show Two",
              synopsis: "This is the synopsis for TV Show Two.",
              poster: "http://example.com/poster2.jpg",
              premiereDate: "2024-01-02",
              originalName: "Original TV Show Two",
              createdAt: new Date("2024-01-02"),
            },
          ],
        })
      ).rejects.toThrow(
        "List does not exist or you do not have permission to modify this list!"
      )
    })

    it("should throw an error if the list has no items", async () => {
      const mockUpdatedList = {
        id: "list123",
        name: "My List",
        userId: "user123",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      jest
        .spyOn(listsRepository, "findListByIdAndUserId")
        .mockResolvedValue(mockUpdatedList)
      jest.spyOn(listsRepository, "findListItems").mockResolvedValue([])

      await expect(
        listsService.updateListOrder({
          listId: "list123",
          userId: "2",
          tvShows: [
            {
              id: "1",
              title: "TV Show One",
              synopsis: "This is the synopsis for TV Show One.",
              poster: "http://example.com/poster.jpg",
              premiereDate: "2024-01-01",
              originalName: "Original TV Show One",
              createdAt: new Date("2024-01-01"),
            },
            {
              id: "2",
              title: "TV Show Two",
              synopsis: "This is the synopsis for TV Show Two.",
              poster: "http://example.com/poster2.jpg",
              premiereDate: "2024-01-02",
              originalName: "Original TV Show Two",
              createdAt: new Date("2024-01-02"),
            },
          ],
        })
      ).rejects.toThrow("This list has no items to reorder!")
    })

    it("should update the list order", async () => {
      const mockList = {
        id: "list123",
        name: "My List",
        userId: "user123",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

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
            poster: "http://example.com/poster.jpg",
            premiereDate: new Date("2024-01-01"),
            originalName: "Original Test TV Show",
            createdAt: new Date("2024-01-01"),
            order: 3,
          },
        ],
      }

      jest
        .spyOn(listsRepository, "findListByIdAndUserId")
        .mockResolvedValue(mockList)
      jest.spyOn(listsRepository, "findListItems").mockResolvedValue([
        {
          id: "item1",
          tvShowId: "tvshow1",
          order: 1,
          listId: "list123",
          addedAt: new Date(),
        },
        {
          id: "item2",
          tvShowId: "tvshow2",
          order: 2,
          listId: "list123",
          addedAt: new Date(),
        },
        {
          id: "item3",
          tvShowId: "tvshow3",
          order: 2,
          listId: "list123",
          addedAt: new Date(),
        },
      ])
      jest.spyOn(listsRepository, "findListById").mockResolvedValue({
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
            poster: "http://example.com/poster.jpg",
            premiereDate: new Date("2024-01-01"),
            originalName: "Original Test TV Show",
            createdAt: new Date("2024-01-01"),
            order: 3,
          },
        ],
      })
      jest.spyOn(listsRepository, "updateItemOrder").mockResolvedValue({
        id: "item1",
        tvShowId: "tvshow1",
        order: 1,
        addedAt: new Date(),
        listId: "list123",
      })

      jest.spyOn(listsRepository, "transaction").mockResolvedValue([
        {
          id: "item1",
          tvShowId: "tvshow1",
          order: 1,
          addedAt: new Date(),
          listId: "list123",
        },
        {
          id: "item2",
          tvShowId: "tvshow2",
          order: 3,
          addedAt: new Date(),
          listId: "list123",
        },
      ])

      const updatedList = await listsService.updateListOrder({
        listId: "list123",
        userId: "user123",
        tvShows: [
          {
            id: "tvshow1",
            title: "TV Show One",
            synopsis: "This is the synopsis for TV Show One.",
            poster: "http://example.com/poster.jpg",
            premiereDate: "2024-01-01",
            originalName: "Original TV Show One",
            createdAt: new Date("2024-01-01"),
          },
          {
            id: "tvshow2",
            title: "TV Show Two",
            synopsis: "This is the synopsis for TV Show Two.",
            poster: "http://example.com/poster2.jpg",
            premiereDate: "2024-01-02",
            originalName: "Original TV Show Two",
            createdAt: new Date("2024-01-02"),
          },
        ],
      })
      expect(updatedList).toEqual(mockListWithTvShows)
    })
  })

  describe("addTvShowToList", () => {
    it("should throw an error if list does not exist", async () => {
      jest
        .spyOn(listsRepository, "findListById")
        .mockResolvedValueOnce({ tvShows: undefined })

      await expect(
        listsService.addTvShowToList({
          listId: "nonexistent",
          tvShowId: "tvshow1",
          userId: "user123",
        })
      ).rejects.toThrow("List does not exist!")
    })

    it("should throw an error if tv show does not exist", async () => {
      jest.spyOn(listsRepository, "findListById").mockResolvedValueOnce({
        id: "list123",
        name: "My List",
        userId: "user123",
        tvShows: [],
      })

      await expect(
        listsService.addTvShowToList({
          listId: "nonexistent",
          tvShowId: "tvshow1",
          userId: "user12",
        })
      ).rejects.toThrow("You do not have permission to modify this list!")
    })

    it("should throw an error if tv show does not exist", async () => {
      jest.spyOn(listsRepository, "findListById").mockResolvedValueOnce({
        id: "list123",
        name: "My List",
        userId: "user123",
        tvShows: [],
      })
      jest.spyOn(tvShowRepository, "findTvShowById").mockResolvedValueOnce(null)

      await expect(
        listsService.addTvShowToList({
          listId: "nonexistent",
          tvShowId: "tvshow1",
          userId: "user123",
        })
      ).rejects.toThrow("TV Show does not exist!")
    })

    it("should throw an error if tv show is already in the list", async () => {
      jest.spyOn(listsRepository, "findListById").mockResolvedValueOnce({
        id: "list123",
        name: "My List",
        userId: "user123",
        tvShows: [
          {
            id: "item1",
            title: "Test TV Show",
            synopsis: "This is a test TV show.",
            poster: "http://example.com/poster.jpg",
            premiereDate: new Date("2024-01-01"),
            originalName: "Original Test TV Show",
            createdAt: new Date("2025-01-01"),
            order: 1,
          },
        ],
      })
      jest.spyOn(tvShowRepository, "findTvShowById").mockResolvedValueOnce({
        id: "item1",
        title: "Test TV Show",
        synopsis: "This is a test TV show.",

        poster: "http://example.com/poster.jpg",
        premiereDate: new Date("2024-01-01"),
        originalName: "Original Test TV Show",
        createdAt: new Date("2025-01-01"),
      })

      jest.spyOn(listsRepository, "findTvShowInList").mockResolvedValueOnce({
        id: "item1",
        tvShowId: "tvshow1",
        order: 1,
        listId: "list123",
        addedAt: new Date("2025-01-01"),
      })

      await expect(
        listsService.addTvShowToList({
          listId: "newlis",
          tvShowId: "item1",
          userId: "user123",
        })
      ).rejects.toThrow("The TV Show already exists in this list!")
    })

    it("should add a TV show to the list", async () => {
      const returnedListMock = {
        id: "list123",
        name: "My List",
        userId: "user123",
        tvShows: [
          {
            id: "item1",
            title: "Test TV Show",
            synopsis: "This is a test TV show.",
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
            poster: "http://example.com/poster2.jpg",
            premiereDate: new Date("2024-02-01"),
            originalName: "Original Test TV Show 2",
            createdAt: new Date("2025-02-01"),
            order: 2,
          },
        ],
      }

      jest.spyOn(listsRepository, "findListById").mockResolvedValueOnce({
        id: "list123",
        name: "My List",
        userId: "user123",
        tvShows: [
          {
            id: "item1",
            title: "Test TV Show",
            synopsis: "This is a test TV show.",
            poster: "http://example.com/poster.jpg",
            premiereDate: new Date("2024-01-01"),
            originalName: "Original Test TV Show",
            createdAt: new Date("2025-01-01"),
            order: 1,
          },
        ],
      })
      jest.spyOn(tvShowRepository, "findTvShowById").mockResolvedValueOnce({
        id: "item1",
        title: "Test TV Show",
        synopsis: "This is a test TV show.",

        poster: "http://example.com/poster.jpg",
        premiereDate: new Date("2024-01-01"),
        originalName: "Original Test TV Show",
        createdAt: new Date("2025-01-01"),
      })

      jest
        .spyOn(listsRepository, "findTvShowInList")
        .mockResolvedValueOnce(null)

      jest.spyOn(listsRepository, "addTvShowOnTheList").mockResolvedValueOnce({
        id: "item2",
        tvShowId: "item2",
        order: 2,
        listId: "list123",
        addedAt: new Date(),
      })

      jest
        .spyOn(listsRepository, "findListById")
        .mockResolvedValueOnce(returnedListMock)

      await expect(
        listsService.addTvShowToList({
          listId: "newlis",
          tvShowId: "item1",
          userId: "user123",
        })
      ).resolves.toEqual(returnedListMock)
    })
  })

  describe("createList", () => {
    it("should throw an error if a list with the same name already exists for the user", async () => {
      jest
        .spyOn(listsRepository, "findListByNameAndUserId")
        .mockResolvedValueOnce({
          id: "list123",
          name: "My List",
          userId: "user123",
          createdAt: new Date(),
          updatedAt: new Date(),
        })

      await expect(
        listsService.createList({
          name: "My List",
          userId: "user123",
        })
      ).rejects.toThrow("List with this name already exists for the user!")
    })

    it("should create a new list", async () => {
      const mockNewList = {
        id: "list124",
        name: "New List",
        userId: "user123",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      jest
        .spyOn(listsRepository, "findListByNameAndUserId")
        .mockResolvedValueOnce(null)
      jest
        .spyOn(listsRepository, "createList")
        .mockResolvedValueOnce(mockNewList)

      const createdList = await listsService.createList({
        name: "New List",
        userId: "user123",
      })
      expect(createdList).toEqual(mockNewList)
    })
  })

  describe("findAllListsByUserId", () => {
    it("should return all lists for a user", async () => {
      const mockLists = [
        {
          id: "list123",
          name: "My List",
          userId: "user123",
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
          tvShows: [
            {
              id: "item1",
              title: "Test TV Show",
              synopsis: "This is a test TV show.",
              poster: "http://example.com/poster.jpg",
              premiereDate: new Date("2024-01-01"),
              originalName: "Original Test TV Show",
              createdAt: new Date("2025-01-01"),
              order: 1,
            },
          ],
        },
      ]
      jest
        .spyOn(listsRepository, "getAllListsByUserId")
        .mockResolvedValueOnce(mockLists)

      const lists = await listsService.getAllListsByUserId("user123")
      expect(lists).toEqual(mockLists)
    })
  })

  describe("findAllListsByUserId", () => {
    it("should return all lists for a user", async () => {
      const mockLists = [
        {
          id: "list123",
          name: "My List",
          userId: "user123",
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
          tvShows: [
            {
              id: "item1",
              title: "Test TV Show",
              synopsis: "This is a test TV show.",
              poster: "http://example.com/poster.jpg",
              premiereDate: new Date("2024-01-01"),
              originalName: "Original Test TV Show",
              createdAt: new Date("2025-01-01"),
              order: 1,
            },
          ],
        },
      ]
      jest
        .spyOn(listsRepository, "getAllListsByUserEmail")
        .mockResolvedValueOnce(mockLists)
      const lists = await listsService.getAllListsByUserEmail(
        "user123@example.com"
      )
      expect(lists).toEqual(mockLists)
    })
  })

  describe("findLisById", () => {
    it("should return the list for a given id", async () => {
      const mockList = {
        id: "list123",
        name: "My List",
        userId: "user123",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
        tvShows: [
          {
            id: "item1",
            title: "Test TV Show",
            synopsis: "This is a test TV show.",
            poster: "http://example.com/poster.jpg",
            premiereDate: new Date("2024-01-01"),
            originalName: "Original Test TV Show",
            createdAt: new Date("2025-01-01"),
            order: 1,
          },
        ],
      }
      jest
        .spyOn(listsRepository, "findListById")
        .mockResolvedValueOnce(mockList)

      const list = await listsService.findListById("list123")
      expect(list).toEqual(mockList)
    })
  })
})
