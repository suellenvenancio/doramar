import ratingsRepository from "../repository/ratings.repository"
import tvShowRepository from "../repository/tvshow.repository"
import { AppError } from "../utils/errors"

export async function createRating({
  userId,
  tvShowId,
  scaleId,
}: {
  userId: string
  tvShowId: string
  scaleId: number
}) {
  try {
    const existingTvShow = await tvShowRepository.findTvShowById(tvShowId)
    if (!existingTvShow) {
      throw new AppError("TV Show not found!", 404)
    }

    const existingRating = await ratingsRepository.getRatingByUserIdAndTvShowId(
      userId,
      tvShowId,
    )

    if (existingRating && existingRating.scaleId === scaleId) {
      return existingRating
    }

    if (existingRating && existingRating.scaleId !== scaleId) {
      return await ratingsRepository.updateRatingScaleId({
        ratingId: existingRating.id,
        scaleId,
      })
    }

    return await ratingsRepository.createRating({ userId, tvShowId, scaleId })
  } catch (error) {
    throw error
  }
}

export async function getRatingsByUserId(userId: string) {
  try {
    return await ratingsRepository.getRatingsByUserId(userId)
  } catch (error) {
    throw error
  }
}

async function getRatingScales() {
  try {
    return await ratingsRepository.getRatingScales()
  } catch (error) {
    throw error
  }
}

async function createRatingScale({ id, label }: { id: number; label: string }) {
  try {
    return await ratingsRepository.createRatingScale(id, label)
  } catch (error) {
    throw error
  }
}

async function getRatingById(ratingId: string) {
  try {
    return await ratingsRepository.getRatingById(ratingId)
  } catch (error) {
    throw error
  }
}

const ratingsService = {
  createRatingScale,
  createRating,
  getRatingsByUserId,
  getRatingById,
  getRatingScales,
}

export default ratingsService
