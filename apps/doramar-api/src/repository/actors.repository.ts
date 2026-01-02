import { prisma } from "../lib/prisma"

async function getAllActors() {
  return await prisma.actors.findMany()
}

async function findFavoriteActorsByUserId(userId: string) {
  return await prisma.userFavoriteActors.findMany({
    where: { userId },
    include: {
      actor: true,
    },
  })
}

async function addActorToFavorites(userId: string, actorId: string) {
  return await prisma.userFavoriteActors.create({
    data: {
      userId,
      actorId,
    },
    include: {
      actor: true,
    },
  })
}

async function findFavoriteActorsByUserIdAndActorId(
  userId: string,
  actorId: string
) {
  return await prisma.userFavoriteActors.findUnique({
    where: { userId_actorId: { userId, actorId } },
  })
}

async function removeActorFromFavorites(id: string) {
  return await prisma.userFavoriteActors.delete({
    where: { id: id },
  })
}

const actorsRepository = {
  getAllActors,
  findFavoriteActorsByUserId,
  addActorToFavorites,
  findFavoriteActorsByUserIdAndActorId,
  removeActorFromFavorites,
}

export default actorsRepository
