import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../utils/sendResponse"
import listsServices from "../services/list.service"
import { AppError } from "../utils/errors"

export async function getListsByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params
    const allLists = await listsServices.getAllListsByUserId(userId)
    return sendResponse(res, 200, "Lists retrieved successfully", allLists)
  } catch (error) {
    console.error("Error fetching Lists:", error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error fetching lists by user id!",
      ),
    )
  }
}

export async function getListsByUserEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.query
    const allTvShows = await listsServices.getAllListsByUserEmail(String(email))
    return sendResponse(res, 200, "Lists retrieved successfully", allTvShows)
  } catch (error) {
    console.error("Error fetching Lists:", error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error fetching lists by user email!",
      ),
    )
  }
}

export async function createList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const listData = req.body

    const newList = await listsServices.createList(listData)
    return sendResponse(res, 201, "List created successfully!", newList)
  } catch (e) {
    return next(
      sendResponse(
        res,
        (e as AppError).statusCode || 500,
        (e as AppError).message || "Error creating list!",
      ),
    )
  }
}

export async function addTvShowToList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { listId, tvShowId } = req.params
    const { userId } = req.body

    const list = await listsServices.addTvShowToList({
      listId,
      tvShowId,
      userId,
    })

    return sendResponse(
      res,
      200,
      "TV Show Successfully added to the list",
      list,
    )
  } catch (error) {
    console.error("Error adding TV Show to the list:", error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error adding TV Show to the list!",
      ),
    )
  }
}

export async function updateListOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { tvShows, userId } = req.body
    const { listId } = req.params

    const updatedList = await listsServices.updateListOrder({
      listId,
      tvShows,
      userId,
    })
    return sendResponse(
      res,
      201,
      "List order updated successfully",
      updatedList,
    )
  } catch (error) {
    console.error("Error updating list order:", error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error updating list order!",
      ),
    )
  }
}

export async function deleteList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { listId } = req.params

    await listsServices.deleteList(listId)

    return sendResponse(res, 201, "List deleted successfully")
  } catch (error) {
    console.error("Error updating list order:", error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error delete list order!",
      ),
    )
  }
}

export async function removeTvShowFromTheList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { listId, tvShowId, userId } = req.params

    const list = await listsServices.removeTvShowFromTheList({
      listId,
      tvShowId,
      userId,
    })

    return sendResponse(
      res,
      200,
      "TV Show Successfully added to the list",
      list,
    )
  } catch (error) {
    console.error("Error adding TV Show to the list:", error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error adding TV Show to the list!",
      ),
    )
  }
}
