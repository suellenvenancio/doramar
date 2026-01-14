import { useCallback, useEffect, useState } from "react"

import { toast } from "@/components/toast"
import { tvShowService } from "@/services/tvShow.service"
import type { TvShow, TvShowWithPagination, WatchedTvShow } from "@/types"

import { useUser } from "./use-user"

export function useTvShow() {
  const [tvShows, setTvShows] = useState<TvShow[]>([])
  const [tvShowsByPage, setTvShowByPage] = useState<TvShowWithPagination>()
  const [watchedStatus, setWatchedStatus] = useState<
    { id: number; label: string }[]
  >([])
  const [watchedTvShows, setWatchedTvShows] = useState<WatchedTvShow[]>([])
  const [isLoadingTvShowsByPage, setIsLoadingTvShowsByPage] = useState(false)
  const [favoriteTvShow, setFavoriteTvShow] = useState<TvShow>()
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
        setFavoriteTvShow(fetcheFavTvShow)
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
        console.error(`Erro ao buscar doramas assistidos: ${e}`)
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
      const newPageTvShows = await tvShowService.getTvShowsByPage(page, limit)
      setTvShowByPage(newPageTvShows)
    } catch (error) {
      console.error("Erro ao buscar doramas da próxima página!", error)
      toast("Erro ao buscar doramas da próxima página!")
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

  const findFavoriteTvShowByUserId = useCallback(async (userId: string) => {
    try {
      console.log(userId)
      return await tvShowService.findFavoriteTvShowByUserId(userId)
    } catch (e) {
      console.error(`Erro ao buscar doramas favoritos: ${e}`)
      return null
    }
  }, [])

  const markTvShowAsFavorite = useCallback(
    async (tvShow: TvShow) => {
      if (!user) {
        toast("Erro ao marcar dorama como favorito!")
        return
      }

      try {
        const updatedFavTvShow = await tvShowService.addTVShowToFavorites(
          user.id,
          tvShow.id,
        )

        setFavoriteTvShow(updatedFavTvShow)

        const action = updatedFavTvShow ? "adicionado" : "removido"
        toast(`${tvShow.title} ${action} como favorito!`)
      } catch (error) {
        console.error("Erro ao marcar dorama como favorito", error)
        toast(`Erro ao atualizar favorito: ${tvShow.title}`)
      }
    },
    [user, setFavoriteTvShow],
  )

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
    favoriteTvShow,
    markTvShowAsFavorite,
  }
}
