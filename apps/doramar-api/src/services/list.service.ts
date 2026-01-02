import listsRepository from "../repository/list.repository"
import tvShowRepository from "../repository/tvshow.repository"
import { TvShows } from "../types"
import { AppError } from "../utils/errors"

async function findListById(id: string) {
  try {
    return await listsRepository.findListById(id)
  } catch (error) {
    console.error("Error finding list by id:", error)
    throw new AppError("Error finding list by id!", 500)
  }
}

async function getAllListsByUserId(userId: string) {
  try {
    return await listsRepository.getAllListsByUserId(userId)
  } catch (error) {
    console.error("Error fetching lists by user id:", error)
    throw new AppError("Error fetching lists by user id!", 500)
  }
}
async function getAllListsByUserEmail(email: string) {
  try {
    return await listsRepository.getAllListsByUserEmail(email)
  } catch (error) {
    console.error("Error fetching lists by user email:", error)
    throw new AppError("Error fetching lists by user email!", 500)
  }
}

async function createList(list: { name: string; userId: string }) {
  try {
    const existingList = await listsRepository.findListByNameAndUserId(list)

    if (existingList) {
      throw new AppError(
        "List with this name already exists for the user!",
        400,
      )
    }

    return await listsRepository.createList(list)
  } catch (error) {
    console.error("Error creating list:", error)
    throw new AppError(`Error creating list!: ${error}`, 500)
  }
}

export async function addTvShowToList({
  listId,
  tvShowId,
  userId,
}: {
  listId: string
  tvShowId: string
  userId: string
}) {
  try {
    const list = await listsRepository.findListById(listId)

    if (!list.tvShows && !list.id) {
      throw new AppError("List does not exist!", 404)
    }

    if (list.userId !== userId) {
      throw new AppError("You do not have permission to modify this list!", 403)
    }

    const tvShow = await tvShowRepository.findTvShowById(tvShowId)

    if (!tvShow) {
      throw new AppError("TV Show does not exist!", 404)
    }

    const tvShowIdExistOnTheList = await listsRepository.findTvShowInList({
      listId,
      tvShowId,
    })

    if (tvShowIdExistOnTheList) {
      throw new AppError("The TV Show already exists in this list!", 400)
    }

    let lastItemOfListOrder = 1
    if (list.tvShows && list.tvShows.length > 0) {
      lastItemOfListOrder = list.tvShows[list.tvShows.length - 1].order
    }

    await listsRepository.addTvShowOnTheList({
      listId: listId,
      tvShowId: tvShowId,
      order: lastItemOfListOrder,
    })

    return await listsService.findListById(listId)
  } catch (error) {
    console.error("Error adding TV Show to the list:", error)
    throw new AppError(`Error adding TV Show to the list!: ${error}`, 500)
  }
}

async function updateListOrder({
  listId,
  tvShows,
  userId,
}: {
  listId: string
  tvShows: TvShows[]
  userId: string
}) {
  try {
    const list = await listsRepository.findListByIdAndUserId(listId, userId)

    if (!list) {
      throw new AppError(
        "List does not exist or you do not have permission to modify this list!",
        404,
      )
    }

    const listItems = await listsRepository.findListItems(listId)

    if (!listItems.length) {
      throw new AppError("This list has no items to reorder!", 400)
    }

    const itemsMap = new Map(listItems.map((item) => [item.tvShowId, item.id]))

    const updatePromises = tvShows
      .map((tvShow, index) => {
        const listItemId = itemsMap.get(tvShow.id)

        if (!listItemId) return null

        return listsRepository.updateItemOrder(listItemId, index + 1)
      })
      .filter((promise) => promise !== null)

    if (updatePromises.length === 0) {
      throw new AppError("No valid items found to update order.", 400)
    }
    await listsRepository.transaction(updatePromises)

    return await listsRepository.findListById(listId)
  } catch (error) {
    console.error("Error updating list order transaction:", error)
    throw new AppError(`Failed to update list order: ${error}`, 500)
  }
}

async function deleteList(listId: string) {
  try {
    await listsRepository.deleListById(listId)
  } catch (error) {
    console.error("Error updating list order:", error)
    throw new AppError("Error updating list order!", 500)
  }
}

async function removeTvShowFromTheList({
  listId,
  tvShowId,
  userId,
}: {
  listId: string
  tvShowId: string
  userId: string
}) {
  try {
    const list = await listsRepository.findListById(listId)

    if (!list.tvShows && !list.id) {
      throw new AppError("List does not exist!", 404)
    }

    if (list.userId !== userId) {
      throw new AppError("You do not have permission to modify this list!", 403)
    }

    const tvShow = await tvShowRepository.findTvShowById(tvShowId)

    if (!tvShow) {
      throw new AppError("TV Show does not exist!", 404)
    }

    const tvShowIdExistOnTheList = await listsRepository.findTvShowInList({
      listId,
      tvShowId,
    })

    if (!tvShowIdExistOnTheList) {
      throw new AppError("The TV Show doesn't exists in this list!", 400)
    }

    await listsRepository.removeTvShowFromTheList(tvShowIdExistOnTheList.id)

    return await listsService.findListById(listId)
  } catch (error) {
    console.error("Error adding TV Show to the list:", error)
    throw new AppError("Error adding TV Show to the list!", 500)
  }
}

const listsService = {
  getAllListsByUserId,
  createList,
  addTvShowToList,
  getAllListsByUserEmail,
  updateListOrder,
  findListById,
  deleteList,
  removeTvShowFromTheList,
}

export default listsService
