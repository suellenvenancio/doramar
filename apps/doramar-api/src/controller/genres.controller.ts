import { NextFunction, Request, Response } from "express"
import genreServices from "../services/genres.service"
import { sendResponse } from "../utils/sendResponse"

export async function getAllGenres(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const genres = await genreServices.getAllGenres()
    return sendResponse(res, 200, "Genres retrieved successfully!", genres)
  } catch (error) {
    return next(sendResponse(res, 500, "Error fetching genres!"))
  }
}
