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
  const [isLoadingTvShowsByPage, setIsLoadingTvShowsByPage] = useState(false)
  const [favoriteTvShows, setFavoriteTvShows] = useState<TvShow>()
  const { user } = useUser()

  const userId = user?.id

  useEffect(() => {
    const fetchTvShowAndWatchedStatus = async () => {
      try {
        setIsLoadingTvShowsByPage(true)
        const [
          fetchedTvShows,
          fetchedWatchedStatus,
          fetchTvShowsByPage,
          fetcheFavTvShow,
        ] = await Promise.all([
          tvShowService.getAllTvShows(),
          tvShowService.getWatchedStatus(),
          tvShowService.getTvShowsByPage(1, 20),
          tvShowService.findFavoriteTvShowByUserId(userId || ""),
        ])
        setTvShows(fetchedTvShows)
        setWatchedStatus(fetchedWatchedStatus)
        setTvShowByPage(fetchTvShowsByPage)
        setFavoriteTvShows(fetcheFavTvShow)
      } catch (e) {
        console.error("Erro ao buscar doramas e status assistido!", e)
      } finally {
        setIsLoadingTvShowsByPage(false)
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
          watchedStatusId,
        )

        const updatedWatchedTvShows =
          await tvShowService.getWatchedTvShowsByUserId(userId)
        setWatchedTvShows(updatedWatchedTvShows)
      } catch (e) {
        console.error("Erro ao marcar dorama como assistido!", e)
      }
    },
    [userId],
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

  const findFavoriteTvShowByUserId = useCallback(
    async (userId: string) => {
      try {
        return await tvShowService.findFavoriteTvShowByUserId(userId)
      } catch (e) {
        console.error(`Erro ao buscar doramas favoritos: ${e}`)
        return null
      }
    },
    [userId],
  )

  const markTvShowAsFavorite = useCallback(async (tvShow: TvShow) => {
    try {
      if (!user) return

      await tvShowService
        .addTVShowToFavorites(user.id, tvShow.id)
        .then((updatedFavTvShow) => {
          if (updatedFavTvShow) {
            setFavoriteTvShows(updatedFavTvShow)
          }
          toast(
            `${tvShow.title} ${updatedFavTvShow ? "adicionado" : "removido"} como favorito!`,
          )
        })
        .catch(() => toast(`Erro ao adicionar ${tvShow.title} como favorito`))
    } catch (error) {
      console.error("Erro ao marcar dorama como favorito", error)
    }
  }, [])

  return {
    tvShows,
    watchedStatus,
    watchedTvShows,
    markTvShowAsWatched,
    tvShowsByPage,
    fetchTvShowsByPage,
    getWatchedTvShowsByUserId,
    isLoadingTvShowsByPage,
    findFavoriteTvShowByUserId,
    favoriteTvShows,
    markTvShowAsFavorite,
  }
}
