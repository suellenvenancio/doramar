import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../utils/sendResponse"
import actorsService from "../services/actors.service"
import { AppError } from "../utils/errors"

export async function getAllActors(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const actors = await actorsService.getAllActors()
    return sendResponse(res, 200, "Actors retrieved successfully!", actors)
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error fetching actors!",
      ),
    )
  }
}

export async function findFavoriteActorsByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params
  try {
    const favoriteActors =
      await actorsService.findFavoriteActorsByUserId(userId)
    return sendResponse(
      res,
      200,
      "Favorite actors retrieved successfully!",
      favoriteActors,
    )
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message ||
          "Error fetching favorite actors by user id!",
      ),
    )
  }
}

export async function addActorToFavorites(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId, actorId } = req.body
  try {
    const updatedFavorites = await actorsService.addActorToFavorites(
      userId,
      actorId,
    )
    return sendResponse(
      res,
      200,
      "Actor added to favorites successfully",
      updatedFavorites,
    )
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error adding actor to favorites!",
      ),
    )
  }
}
