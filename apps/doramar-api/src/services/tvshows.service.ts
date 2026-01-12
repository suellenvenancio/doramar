import ratingsRepository from "../repository/ratings.repository"
import tvShowRepository from "../repository/tvshow.repository"
import userRepository from "../repository/user.repository"
import { AppError } from "../utils/errors"

async function getTvShowsByPage(page?: number, limit?: number) {
  try {
    const tvShows = await tvShowRepository.getTvShowsByPage(page, limit)
    const formattedTvShows = tvShows.data.map((tvShow) => {
      return {
        ...tvShow,
        actors: tvShow.actors.flatMap((a) => a.actor),
        genres: tvShow.tvshowGenres.flatMap((g) => g.genre),
      }
    })

    return {
      ...tvShows,
      data: formattedTvShows,
    }
  } catch (error) {
    console.error("Error fetching TV shows:", error)
    throw new Error("Could not fetch TV shows!")
  }
}

async function findWatchedTvShowsByUserId(userId: string) {
  try {
    const user = await userRepository.findUserById(userId)
    if (!user) {
      throw new AppError("User not found!", 404)
    }

    const allWatched = await tvShowRepository.findWatchedTvShowsByUserId(userId)

    const formattedTvShows = await Promise.all(
      allWatched.map(async (w) => {
        const rating = await ratingsRepository.getRatingByUserIdAndTvShowId(
          userId,
          w.tvShowId,
        )

        return {
          ...w.tvShow,
          watchStatus: w.watchedStatus.label,
          ratingScaleId: rating?.scaleId ?? null,
        }
      }),
    )

    return formattedTvShows
  } catch (error) {
    console.error("Error fetching watched TV shows:", error)
    throw new Error("Could not fetch watched TV shows!")
  }
}

async function markTvShowAsWatched(
  userId: string,
  tvShowId: string,
  watchedStatusId: number,
) {
  try {
    const user = await userRepository.findUserById(userId)

    if (!user) {
      throw new AppError("User not found!", 404)
    }

    const tvShow = await tvShowRepository.findTvShowById(tvShowId)

    if (!tvShow) {
      throw new AppError("TV Show not found!", 404)
    }

    const watchedTvShows =
      await tvShowRepository.findWatchedTvShowsByUserId(userId)

    const watched = watchedTvShows.find(
      (watched) => watched.tvShow.id === tvShowId,
    )

    if (watched && watched.watchedStatus.id === watchedStatusId) {
      return {
        ...watched.tvShow,
        watchedStatus: watched.watchedStatus.label,
      }
    }

    if (watched && watched.watchedStatus.id !== watchedStatusId) {
      const updatedWatchedStatus = await tvShowRepository.updateWatchedStatus(
        watched.id,
        Number(watchedStatusId),
      )

      return {
        ...updatedWatchedStatus.tvShow,
        watchedStatus: updatedWatchedStatus.watchedStatus.label,
      }
    }

    const watchedTvShow = await tvShowRepository.markTvShowAsWatched(
      userId,
      tvShowId,
      Number(watchedStatusId),
    )

    return {
      ...watchedTvShow.tvShow,
      watchedStatus: watchedTvShow.watchedStatus.label,
    }
  } catch (error) {
    console.error("Error marking TV show as watched:", error)
    throw new Error("Could not mark TV show as watched!")
  }
}

async function watchedStatus() {
  try {
    return await tvShowRepository.watchedStatus()
  } catch (error) {
    console.error("Error fetching watched status:", error)
    throw new Error("Could not fetch watched status!")
  }
}

async function getAllTvShows() {
  try {
    const tvShows = await tvShowRepository.getAllTvShows()
    return tvShows.map((tvShow) => {
      return {
        ...tvShow,
        actors: tvShow.actors.flatMap((a) => a.actor),
        genres: tvShow.tvshowGenres.flatMap((g) => g.genre),
      }
    })
  } catch (error) {
    console.error("Error fetching TV shows:", error)
    throw new Error("Could not fetch TV shows!")
  }
}

async function findFavoriteTvShowByUser(userId: string) {
  try {
    const user = await userRepository.findUserById(userId)

    if (!user) {
      throw new AppError("User not found!", 404)
    }

    const favoriteTvShow =
      await tvShowRepository.findFavoriteTvShowByUserId(userId)
    return favoriteTvShow?.tvShow
  } catch (error) {
    console.error("Error fetching TV shows:", error)
    throw new Error("Could not favorite TV shows!")
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

const tvShowsService = {
  watchedStatus,
  markTvShowAsWatched,
  getAllTvShows,
  findWatchedTvShowsByUserId,
  getTvShowsByPage,
  findFavoriteTvShowByUser,
  addTVShowToFavorites,
}

export default tvShowsService
