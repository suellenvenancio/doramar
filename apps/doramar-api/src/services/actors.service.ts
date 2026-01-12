import userRepository from "../repository/user.repository"
import actorsRepository from "../repository/actors.repository"
import { AppError } from "../utils/errors"

async function getAllActors() {
  return await actorsRepository.getAllActors()
}

async function findFavoriteActorsByUserId(userId: string) {
  const user = await userRepository.findUserById(userId)

  if (!user) {
    throw new AppError("User not found!", 404)
  }

  const favoriteActors =
    await actorsRepository.findFavoriteActorsByUserId(userId)
  return favoriteActors.map((fav) => fav.actor)
}

async function addActorToFavorites(userId: string, actorId: string) {
  try {
    const existingFavorite =
      await actorsRepository.findFavoriteActorsByUserIdAndActorId(
        userId,
        actorId,
      )

    if (existingFavorite) {
      await actorsRepository.removeActorFromFavorites(existingFavorite.id)
      return undefined
    }

    const addActorAsFavorite = await actorsRepository.addActorToFavorites(
      userId,
      actorId,
    )
    return addActorAsFavorite.actor
  } catch (error) {
    console.error("Error on add actor as favorite:", error)
    throw error
  }
}
const actorsService = {
  addActorToFavorites,
  getAllActors,
  findFavoriteActorsByUserId,
}

export default actorsService
