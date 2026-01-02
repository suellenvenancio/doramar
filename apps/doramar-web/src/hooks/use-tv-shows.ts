import { useCallback, useEffect, useState } from "react"
import { tvShowService } from "@/services/tvShow.service"
import type { TvShow, TvShowWithPagination, WatchedTvShow } from "@/types"
import { useUser } from "./use-user"
import { toast } from "@/components/toast"

export function useTvShow() {
  const [tvShows, setTvShows] = useState<TvShow[]>([])
  const [tvShowsByPage, setTvShowByPage] = useState<TvShowWithPagination>()
  const [watchedStatus, setWatchedStatus] = useState<
    { id: number; label: string }[]
  >([])
  const [watchedTvShows, setWatchedTvShows] = useState<WatchedTvShow[]>([])

  const { user } = useUser()

  const userId = user?.id

  useEffect(() => {
    const fetchTvShowAndWatchedStatus = async () => {
      try {
        const [fetchedTvShows, fetchedWatchedStatus, fetchTvShowsByPage] =
          await Promise.all([
            tvShowService.getAllTvShows(),
            tvShowService.getWatchedStatus(),
            tvShowService.getTvShowsByPage(1, 20),
          ])
        setTvShows(fetchedTvShows)
        setWatchedStatus(fetchedWatchedStatus)
        setTvShowByPage(fetchTvShowsByPage)
      } catch (e) {
        console.error("Erro ao buscar doramas e status assistido!", e)
      }
    }
    fetchTvShowAndWatchedStatus()
  }, [])

  useEffect(() => {
    const fetchWatchedTvShows = async () => {
      if (!userId) return
      try {
        const fetchedWatchedTvshows =
          await tvShowService.getWatchedTvShowsByUserId(userId)

        setWatchedTvShows(fetchedWatchedTvshows)
      } catch (e) {
        console.error("Erro ao buscar doramas assistidos!")
      }
    }
    fetchWatchedTvShows()
  }, [userId])

  const markTvShowAsWatched = useCallback(
    async (tvShow: TvShow, watchedStatusId: string) => {
      if (!userId) return
      try {
        await tvShowService.markTvShowAsWatched(
          userId,
          tvShow.id,
          watchedStatusId
        )

        const updatedWatchedTvShows =
          await tvShowService.getWatchedTvShowsByUserId(userId)
        setWatchedTvShows(updatedWatchedTvShows)
      } catch (e) {
        console.error("Erro ao marcar dorama como assistido!", e)
      }
    },
    [userId]
  )

  const fetchTvShowsByPage = async (page: number, limit: number) => {
    try {
      await tvShowService
        .getTvShowsByPage(page, limit)
        .then((newPageTvShows) => setTvShowByPage(newPageTvShows))
        .catch(() => toast("Erro ao buscar doramas da próxima página!"))
    } catch (error) {
      console.error("Erro ao marcar dorama como assistido!", error)
    }
  }

  const getWatchedTvShowsByUserId = async (userId: string) => {
    try {
      return await tvShowService.getWatchedTvShowsByUserId(userId)
    } catch (error) {
      console.error("Erro ao buscar doramas assistidos!", error)
      return null
    }
  }

  return {
    tvShows,
    watchedStatus,
    watchedTvShows,
    markTvShowAsWatched,
    tvShowsByPage,
    fetchTvShowsByPage,
    getWatchedTvShowsByUserId,
  }
}
