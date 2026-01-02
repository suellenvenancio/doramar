import { NextFunction, Request, Response } from "express"
import ratingsServices from "../services/ratings.service"
import { sendResponse } from "../utils/sendResponse"
import { AppError } from "../utils/errors"

export async function createRating(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, tvShowId, scaleId } = req.body

    const newRating = await ratingsServices.createRating({
      userId,
      tvShowId,
      scaleId,
    })
    return sendResponse(res, 201, "Rating created successfully!", newRating)
  } catch (error) {
    next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error creating rating!",
      ),
    )
  }
}

export async function getRatingsByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params

    const ratings = await ratingsServices.getRatingsByUserId(userId)

    return sendResponse(res, 200, "Ratings fetched successfully", ratings)
  } catch (error) {
    next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error fetching ratings by user id",
      ),
    )
  }
}

export async function getRatingScales(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const scales = await ratingsServices.getRatingScales()
    return sendResponse(res, 200, "Rating scales fetched successfully", scales)
  } catch (error) {
    next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error fetching rating scales!",
      ),
    )
  }
}

export async function createRatingScale(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id, label } = req.body

    const newScale = await ratingsServices.createRatingScale({ id, label })
    return sendResponse(res, 201, "Rating scale created successfully", newScale)
  } catch (error) {
    next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error creating rating scale!",
      ),
    )
  }
}

export async function getRatingById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { ratingId } = req.params

    const rating = await ratingsServices.getRatingById(ratingId)
    return sendResponse(res, 200, "Rating fetched successfully", rating)
  } catch (error) {
    next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error fetching rating by id",
      ),
    )
  }
}
