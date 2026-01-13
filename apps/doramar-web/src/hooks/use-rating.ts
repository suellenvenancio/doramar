import { useCallback, useEffect, useState } from "react"
import { useUser } from "./use-user"
import { ratingService } from "@/services/ratings.service"
import type { RatingWithTvShow } from "@/types"
import { toast } from "@/components/toast"

export function useRating() {
  const [ratings, setRatings] = useState<RatingWithTvShow[]>([])
  const { user } = useUser()

  const userId = user?.id

  useEffect(() => {
    const fetchRatings = async () => {
      if (!userId) return
      try {
        const fetchedRatings = await ratingService.getRatingsByUserId(userId)
        setRatings(fetchedRatings)
      } catch (error) {
        console.error("Failed to fetch ratings:", error)
      }
    }
    fetchRatings()
  }, [userId])

  const createRating = useCallback(
    async (tvShowId: string, scaleId: number) => {
      try {
        if (!userId) {
          toast("Erro ao avaliar dorama!")
          return
        }
        await ratingService.createRating(userId, tvShowId, scaleId)
      } catch (error) {
        toast("Erro ao avaliar dorama!")

        console.error(`Erro ao ao avaliação: ${error}`)
      }
    },
    [userId],
  )

  const getRatingsByUserId = async (userId: string) => {
    try {
      return await ratingService.getRatingsByUserId(userId)
    } catch (error) {
      console.error(`Erro ao buscar avaliações: ${error}`)
      return null
    }
  }

  return {
    createRating,
    ratings,
    getRatingsByUserId,
  }
}
