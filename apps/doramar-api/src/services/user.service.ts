import actorsRepository from "../repository/actors.repository"
import tvShowRepository from "../repository/tvshow.repository"
import userRepository from "../repository/user.repository"
import { RegisterUserInput, User } from "../types"
import { AppError } from "../utils/errors"
import { getAuth } from "firebase-admin/auth"

import { put } from "@vercel/blob"

async function findUserByEmail(email: string) {
  const foundedUser = await userRepository.findByEmail(email)

  if (!foundedUser) {
    throw new AppError("User not found!", 404)
  }

  const favoriteTvShow = await tvShowRepository.findFavoriteTvShowByUserId(
    foundedUser?.id,
  )
  const favoriteActors = await actorsRepository.findFavoriteActorsByUserId(
    foundedUser?.id,
  )

  return {
    id: foundedUser?.id,
    username: foundedUser?.username,
    name: foundedUser?.name,
    email: foundedUser?.email,
    profilePicture: foundedUser?.profilePicture,
    favoriteActors: favoriteActors.map((fav) => fav.actor) || [],
    favoriteTvShow: favoriteTvShow?.tvShow,
    createdAt: foundedUser?.createdAt,
    updatedAt: foundedUser?.updatedAt,
  }
}

async function findUserById(id: string) {
  const foundedUser = await userRepository.findUserById(id)
  const favoriteTvShow = await tvShowRepository.findFavoriteTvShowByUserId(id)
  const favoriteActors = await actorsRepository.findFavoriteActorsByUserId(id)

  return {
    id,
    username: foundedUser.username,
    name: foundedUser.name,
    email: foundedUser.email,
    profilePicture: foundedUser.profilePicture,
    favoriteActors: favoriteActors?.map((fav) => fav.actor) || [],
    favoriteTvShow: favoriteTvShow?.tvShow,
    createdAt: foundedUser.createdAt,
    updatedAt: foundedUser.updatedAt,
  }
}

async function createUser(data: RegisterUserInput) {
  try {
    await getAuth()
      .createUser({
        email: data.email,
        password: data.password,
        displayName: data.name,
      })
      .then(async () => {
        return await validateAndCreateUser(data)
      })
      .catch(async (error) => {
        if (
          error.message ===
          "The email address is already in use by another account."
        ) {
          return await validateAndCreateUser(data)
        }
        console.error("Error creating user in Firebase:", error)
        throw error
      })
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}
async function validateAndCreateUser({
  email,
  username,
  name,
  password,
}: {
  email: string
  username: string
  name: string
  password: string
}) {
  try {
    await userRepository.validationUniqueEmail(email)
    await userRepository.validationUniqueUsername(username)

    return await userRepository.createUser({ email, username, name, password })
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

async function updateUser(
  id: string,
  data: Partial<Omit<User, "id" | "createdAt">>,
) {
  try {
    const foundedUser = await userRepository.findUserById(id)

    if (data.email && data.email !== foundedUser.email) {
      await userRepository.validationUniqueEmail(data.email)
    }

    if (data.username && data.username !== foundedUser.username) {
      await userRepository.validationUniqueUsername(data.username)
    }

    return userRepository.updateUser(id, data)
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

async function deleteUser(id: string) {
  try {
    await userRepository.findUserById(id)

    await userRepository.deleteUser(id)
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

async function uploadProfilePicture(userId: string, file: Express.Multer.File) {
  try {
    const user = await userRepository.findUserById(userId)

    if (!user) {
      throw new AppError("User not found!", 404)
    }
    const token = process.env.BLOB_VERCEL_READ_WRITE_TOKEN

    const blob = await put(
      `images/${Date.now()}-${file.originalname}`,
      file.buffer,
      {
        access: "public",
        token,
      },
    )

    return await userRepository.updateUser(userId, {
      profilePicture: blob.url,
    })
  } catch (error) {
    console.error("Error uploading avatar:", error)
    throw error
  }
}

async function addTVShowToFavorites(userId: string, tvShowId: string) {
  try {
    const user = await userRepository.findUserById(userId)

    if (!user) {
      throw new AppError("User not found!", 404)
    }

    const tvShow = await tvShowRepository.findTvShowById(tvShowId)

    if (!tvShow) {
      throw new AppError("TV Show not found!", 404)
    }

    const existentFavoriteTvShow =
      await tvShowRepository.findFavoriteTvShowByUserId(userId)

    if (
      existentFavoriteTvShow &&
      existentFavoriteTvShow?.tvShow.id !== tvShowId
    ) {
      const favoriteTvShow = await tvShowRepository.updateFavoriteTvShow(
        userId,
        tvShowId,
        existentFavoriteTvShow.id,
      )
      return {
        ...user,
        favoriteTvShow: favoriteTvShow.tvShow,
      }
    }

    if (
      existentFavoriteTvShow &&
      existentFavoriteTvShow?.tvShowId === tvShowId
    ) {
      await tvShowRepository.removeTvShowAsFavorite(existentFavoriteTvShow.id)
      return {
        ...user,
        favoriteTvShow: undefined,
      }
    }

    const favoriteTvShow = await tvShowRepository.addTVShowToFavorite(
      userId,
      tvShowId,
    )

    return {
      ...user,
      favoriteTvShow: favoriteTvShow.tvShow,
    }
  } catch (error) {
    console.error("Error adding TV show to favorites:", error)
    throw error
  }
}

async function findUserByUsername(username: string) {
  try {
    return await userRepository.findUserByUsername(username)
  } catch (error) {
    console.error("Error on search user by username:", error)
    throw error
  }
}

const userService = {
  uploadProfilePicture,
  findUserByEmail,
  createUser,
  deleteUser,
  updateUser,
  findUserById,
  addTVShowToFavorites,
  findUserByUsername,
}

export default userService
