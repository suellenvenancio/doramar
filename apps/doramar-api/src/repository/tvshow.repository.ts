import { prisma } from "../lib/prisma"

async function getTvShowsByPage(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit

  const [tvShows, totalCount] = await Promise.all([
    prisma.tvShows.findMany({
      skip: skip,
      take: limit,
      include: {
        actors: {
          include: {
            actor: true,
          },
        },
        tvshowGenres: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    }),
    prisma.tvShows.count(),
  ])

  return {
    data: tvShows,
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  }
}

async function findTvShowById(tvShowId: string) {
  return await prisma.tvShows.findUnique({
    where: { id: tvShowId },
  })
}

async function createTvShow(tvShowData: any) {
  return await prisma.tvShows.create({
    data: tvShowData,
  })
}

async function updateTvShow(tvShowId: string, tvShowData: any) {
  return await prisma.tvShows.update({
    where: { id: tvShowId },
    data: tvShowData,
  })
}

async function deleteTvShow(tvShowId: string) {
  try {
    return await prisma.tvShows.delete({
      where: { id: tvShowId },
    })
  } catch (e) {
    console.log(e)
  }
}

async function findFavoriteTvShowByUserId(userId: string) {
  return await prisma.userFavoriteTvShow.findFirst({
    where: { userId },
    include: {
      tvShow: true,
    },
  })
}

async function findWatchedTvShowsByUserId(userId: string) {
  return await prisma.userWatchedTvShows.findMany({
    where: { userId },
    include: {
      tvShow: true,
      watchedStatus: true,
    },
  })
}

async function updateFavoriteTvShow(
  userId: string,
  tvShowId: string,
  id: string
) {
  return await prisma.userFavoriteTvShow.update({
    where: {
      id: id,
    },
    data: {
      userId,
      tvShowId,
    },
    include: {
      tvShow: true,
    },
  })
}

async function addTVShowToFavorite(userId: string, tvShowId: string) {
  return await prisma.userFavoriteTvShow.create({
    data: {
      userId,
      tvShowId,
    },
    include: {
      tvShow: true,
    },
  })
}

async function markTvShowAsWatched(
  userId: string,
  tvShowId: string,
  watchedStatusId: number
) {
  return await prisma.userWatchedTvShows.create({
    data: {
      userId,
      tvShowId,
      watchedStatusId,
    },
    include: {
      tvShow: true,
      watchedStatus: true,
    },
  })
}

async function watchedStatus() {
  return await prisma.watchedStatus.findMany()
}

async function updateWatchedStatus(id: string, watchedStatusId: number) {
  return await prisma.userWatchedTvShows.update({
    where: {
      id,
    },
    data: {
      watchedStatusId,
    },
    include: {
      tvShow: true,
      watchedStatus: true,
    },
  })
}

async function removeTvShowAsFavorite(id: string) {
  return prisma.userFavoriteTvShow.delete({
    where: {
      id: id,
    },
  })
}

async function getAllTvShows() {
  return await prisma.tvShows.findMany({
    include: {
      actors: {
        include: {
          actor: true,
        },
      },
      tvshowGenres: {
        include: {
          genre: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  })
}

const tvShowRepository = {
  watchedStatus,
  markTvShowAsWatched,
  updateFavoriteTvShow,
  addTVShowToFavorite,
  findFavoriteTvShowByUserId,
  findWatchedTvShowsByUserId,
  createTvShow,
  getAllTvShows,
  findTvShowById,
  updateTvShow,
  deleteTvShow,
  updateWatchedStatus,
  removeTvShowAsFavorite,
  getTvShowsByPage,
}

export default tvShowRepository
