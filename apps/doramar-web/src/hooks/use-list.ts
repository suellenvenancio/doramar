import { useCallback, useEffect, useState } from "react"
import { listService } from "@/services/lists.service"
import type { List, ListWithTvShows, TvShow } from "@/types"
import { useUser } from "./use-user"
import { toast } from "@/components/toast"

export function useList() {
  const [lists, setLists] = useState<ListWithTvShows[]>([])
  const { user } = useUser()

  const userId = user?.id

  useEffect(() => {
    const fetchLists = async () => {
      if (!userId) return
      const fetchedLists = await listService.getListsByUserId(userId)
      setLists(fetchedLists)
    }
    fetchLists()
  }, [userId])

  const addTvShowToList = useCallback(
    async (list: List, tvShow: TvShow) => {
      if (!userId) return
      await listService
        .addTvShowToList(list.id, tvShow.id, userId)
        .then(async () => {
          toast(`${tvShow.title} adicionado a lista, com sucesso`)
          const listsFetched = await listService.getListsByUserId(userId)

          setLists(listsFetched)
        })
        .catch(() => toast(`Erro ao adicionar ${tvShow.title} à lista!`))
    },
    [userId],
  )

  const createList = useCallback(
    async (name: string) => {
      if (!userId) return

      await listService
        .createList(name, userId)
        .then(async () => {
          const fetchedLists = await listService.getListsByUserId(userId)

          setLists(fetchedLists)
        })
        .catch(() => toast("Erro ao cria lista!"))
    },
    [userId],
  )

  const deleteList = useCallback(async (listId: string) => {
    try {
      await listService
        .deleteList(listId)
        .then(async () => {
          if (!userId) return
          const fetchedLists = await listService.getListsByUserId(userId)

          setLists(fetchedLists)
        })
        .catch(() => toast("Erro ao excluir lista!"))
    } catch (error) {
      console.error(`Error ao remover lista: ${error}`)
    }
  }, [])

  const removeTvShowFromTheList = async ({
    listId,
    tvShow,
  }: {
    listId: string
    tvShow: TvShow
  }) => {
    if (!userId) return

    try {
      await listService
        .removeTvShowFromTheList({
          listId,
          userId,
          tvShowId: tvShow.id,
        })
        .then(async () => {
          const listsFetched = await listService.getListsByUserId(userId)

          setLists(listsFetched)
        })
        .catch(() => toast(`Erro ao adicionar ${tvShow.title} à lista!`))
    } catch (error) {
      console.error(`Erro ao remover item da lista: ${error}`)
    }
  }

  const updateListOrder = async ({
    listId,
    tvShows,
  }: {
    listId: string
    tvShows: TvShow[]
  }) => {
    if (!userId) return

    try {
      const updatedList = await listService.updaListOrder({
        listId,
        tvShows,
        userId,
      })

      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === updatedList.id ? updatedList : list,
        ),
      )
    } catch (error) {
      console.error(`Erro ao atualizar a ordem da lista: ${error}`)
    }
  }

  const getListsByUserId = async (userId: string) => {
    try {
      return await listService.getListsByUserId(userId)
    } catch (error) {
      console.error(`Erro ao buscar listas: ${error}`)
      return null
    }
  }

  return {
    lists,
    addTvShowToList,
    createList,
    deleteList,
    removeTvShowFromTheList,
    updateListOrder,
    getListsByUserId,
  }
}
