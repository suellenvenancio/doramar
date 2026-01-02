import { NextFunction, Request, Response } from "express"
import tvShowsServices from "../services/tvshows.service"
import { sendResponse } from "../utils/sendResponse"
import { AppError } from "../utils/errors"

export async function getTvShowsByPage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string)

    const allTvShows = await tvShowsServices.getTvShowsByPage(page, limit)

    return sendResponse(res, 200, "TV shows retrieved successfully!", {
      ...allTvShows.meta,
      results: allTvShows.data,
    })
  } catch (error) {
    console.error("Error fetching TV shows:", error)
    return next(sendResponse(res, 500, "Internal Server Error"))
  }
}

export async function createTvShow(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tvShowData = req.body
    const newTvShow = await tvShowsServices.createTvShow(tvShowData)
    return sendResponse(res, 201, "TV show created successfully!", newTvShow)
  } catch (error: unknown) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Internal Server Error",
      ),
    )
  }
}

export async function findWatchedTvShowsByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params
  try {
    const watchedTvShows =
      await tvShowsServices.findWatchedTvShowsByUserId(userId)
    return sendResponse(
      res,
      200,
      "Watched TV shows retrieved successfully",
      watchedTvShows,
    )
  } catch (error) {
    return next(sendResponse(res, 500, "Error fetching watched TV shows!"))
  }
}

export async function markTvShowAsWatched(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, tvShowId, watchedStatusId } = req.body

    const watchedTvShow = await tvShowsServices.markTvShowAsWatched(
      userId,
      tvShowId,
      watchedStatusId,
    )
    return sendResponse(
      res,
      200,
      "TV show marked as watched successfully",
      watchedTvShow,
    )
  } catch (error) {
    return next(sendResponse(res, 500, "Error marking TV show as watched!"))
  }
}

export async function getWatchedStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const watchedStatus = await tvShowsServices.watchedStatus()
    return sendResponse(
      res,
      200,
      "Watched statuses retrieved successfully",
      watchedStatus,
    )
  } catch (error) {
    return next(sendResponse(res, 500, "Error fetching watched statuses!"))
  }
}

export async function getAllTvShows(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const allTvShows = await tvShowsServices.getAllTvShows()
    return sendResponse(
      res,
      200,
      "TV shows retrieved successfully!",
      allTvShows,
    )
  } catch (error) {
    console.error("Error fetching TV shows:", error)
    return next(sendResponse(res, 500, "Internal Server Error"))
  }
}
