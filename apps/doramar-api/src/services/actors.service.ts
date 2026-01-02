import actorsRepository from "../repository/actors.repository"

async function getAllActors() {
  return await actorsRepository.getAllActors()
}

async function findFavoriteActorsByUserId(userId: string) {
  return await actorsRepository.findFavoriteActorsByUserId(userId)
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
