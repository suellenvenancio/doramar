import { prisma } from "../lib/prisma"

export async function createRating(data: {
  userId: string
  tvShowId: string
  scaleId: number
}) {
  return await prisma.ratings.create({
    data: {
      ...data,
    },
    include: {
      scale: true,
      tvShow: true,
    },
  })
}

export async function getRatingsByUserId(userId: string) {
  return await prisma.ratings.findMany({
    where: { userId },
    include: {
      tvShow: true,
      scale: true,
    },
  })
}

export async function updateRatingScaleId({
  ratingId,
  scaleId,
}: {
  ratingId: string
  scaleId: number
}) {
  return await prisma.ratings.update({
    where: { id: ratingId },
    data: {
      scaleId: scaleId,
    },
    include: {
      scale: true,
      tvShow: true,
    },
  })
}

async function getRatingScales() {
  return await prisma.ratingScale.findMany({
    orderBy: {
      id: "asc",
    },
  })
}

function getRatingByUserIdAndTvShowId(userId: string, tvShowId: string) {
  return prisma.ratings.findFirst({
    where: {
      userId: userId,
      tvShowId: tvShowId,
    },
    include: {
      tvShow: true,
      scale: true,
    },
  })
}

async function findRatingById(ratingId: string) {
  return await prisma.ratings.findUnique({
    where: { id: ratingId },
  })
}

async function createRatingScale(value: number, description: string) {
  return await prisma.ratingScale.create({
    data: {
      id: value,
      label: description,
    },
  })
}

function getRatingById(ratingId: string) {
  return prisma.ratings.findUnique({
    where: {
      id: ratingId,
    },
  })
}

const ratingsRepository = {
  createRatingScale,
  findRatingById,
  getRatingById,
  createRating,
  getRatingsByUserId,
  updateRatingScaleId,
  getRatingScales,
  getRatingByUserIdAndTvShowId,
}

export default ratingsRepository
