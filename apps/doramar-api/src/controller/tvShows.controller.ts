import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../utils/sendResponse"
import { AppError } from "../utils/errors"
import tvShowsService from "../services/tvshows.service"

export async function getTvShowsByPage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string)

    const allTvShows = await tvShowsService.getTvShowsByPage(page, limit)

    return sendResponse(res, 200, "TV shows retrieved successfully!", {
      ...allTvShows.meta,
      results: allTvShows.data,
    })
  } catch (error) {
    console.error("Error fetching TV shows:", error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error fetching Tv shows!",
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
      await tvShowsService.findWatchedTvShowsByUserId(userId)
    return sendResponse(
      res,
      200,
      "Watched TV shows retrieved successfully",
      watchedTvShows,
    )
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error fetching watched TV shows!",
      ),
    )
  }
}

export async function markTvShowAsWatched(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, tvShowId, watchedStatusId } = req.body

    const watchedTvShow = await tvShowsService.markTvShowAsWatched(
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
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error marking TV show as watched!",
      ),
    )
  }
}

export async function getWatchedStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const watchedStatus = await tvShowsService.watchedStatus()
    return sendResponse(
      res,
      200,
      "Watched statuses retrieved successfully",
      watchedStatus,
    )
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error fetching watched status!",
      ),
    )
  }
}

export async function getAllTvShows(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const allTvShows = await tvShowsService.getAllTvShows()
    return sendResponse(
      res,
      200,
      "TV shows retrieved successfully!",
      allTvShows,
    )
  } catch (error) {
    console.error("Error fetching TV shows:", error)
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error fetching tv shows!",
      ),
    )
  }
}

export async function findFavoriteTvShowByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params
    const favoriteTvShow = await tvShowsService.findFavoriteTvShowByUser(userId)
    return sendResponse(
      res,
      200,
      "Favorite TV show retrieved successfully!",
      favoriteTvShow,
    )
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error fetching user favorite tv show!",
      ),
    )
  }
}

export async function addTVShowToFavorites(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params
  const { tvShowId } = req.body

  try {
    const user = await tvShowsService.addTVShowToFavorites(userId, tvShowId)

    return sendResponse(
      res,
      200,
      "TV show added to favorites successfully",
      user,
    )
  } catch (error) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error adding TV show to favorites!",
      ),
    )
  }
}
