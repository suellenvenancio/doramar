import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../utils/sendResponse"
import userService from "../services/user.service"
import { AppError } from "../utils/errors"

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userData = req.body
  try {
    const newUser = await userService.createUser({
      ...userData,
    })

    return sendResponse(res, 201, "User registered successfully", {
      ...newUser,
    })
  } catch (error: Error | any) {
    console.error("Error registering user:", error)

    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error registering user",
      ),
    )
  }
}

export async function findUserById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params

    const user = await userService.findUserById(userId)
    return sendResponse(res, 200, "User returned successfully", user)
  } catch (error: unknown) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error getting user by ID",
      ),
    )
  }
}

export async function findUserByEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.query
    console.log(email)
    const user = await userService.findUserByEmail(String(email))

    return sendResponse(res, 200, "User returned successfully", user)
  } catch (error: unknown) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error getting user by email",
      ),
    )
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params
    const user = req.body
    const updatedUser = await userService.updateUser(userId, user)
    return sendResponse(res, 200, "User Successfully updated!", updatedUser)
  } catch (e: unknown) {
    return next(
      sendResponse(
        res,
        (e as AppError).statusCode || 500,
        (e as AppError).message || "Error updating user",
      ),
    )
  }
}

export async function deleteUserById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params
    const user = await userService.deleteUser(userId)
    return sendResponse(res, 200, "User deleted successfully!", user)
  } catch (error: unknown) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error deleting user!",
      ),
    )
  }
}

export async function uploadProfilePicture(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const file = req.file
    if (!file) {
      return sendResponse(res, 400, "No file uploaded")
    }
    const { userId } = req.params

    const userWithAvatar = await userService.uploadProfilePicture(userId, file)
    return sendResponse(
      res,
      200,
      "Avatar uploaded successfully",
      userWithAvatar,
    )
  } catch (error: unknown) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error uploading avatar",
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
    const user = await userService.addTVShowToFavorites(userId, tvShowId)

    return sendResponse(
      res,
      200,
      "TV show added to favorites successfully",
      user,
    )
  } catch (error) {
    return next(sendResponse(res, 500, "Error adding TV show to favorites!"))
  }
}

export async function findUserByUsername(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username } = req.query

    const user = await userService.findUserByUsername(String(username))

    return sendResponse(res, 200, "User returned successfully", user)
  } catch (error: unknown) {
    return next(
      sendResponse(
        res,
        (error as AppError).statusCode || 500,
        (error as AppError).message || "Error getting user by email",
      ),
    )
  }
}
