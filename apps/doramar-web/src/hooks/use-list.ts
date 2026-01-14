import { useCallback, useEffect, useState } from "react"

import { toast } from "@/components/toast"
import { listService } from "@/services/lists.service"
import type { List, ListWithTvShows, TvShow } from "@/types"

import { useUser } from "./use-user"

export function useList() {
  const [lists, setLists] = useState<ListWithTvShows[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()

  const userId = user?.id

  useEffect(() => {
    const fetchLists = async () => {
      if (!userId) return

      try {
        setIsLoading(true)
        const fetchedLists = await listService.getListsByUserId(userId)
        setLists(fetchedLists)
      } catch (error) {
        console.log(`Erro ao buscar listas: ${error}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLists()
  }, [userId])

  const addTvShowToList = useCallback(
    async (list: List, tvShow: TvShow) => {
      if (!userId) {
        toast("Erro ao adicionar dorama a lista!")
        return
      }
      try {
        await listService.addTvShowToList(list.id, tvShow.id, userId)
        toast(`${tvShow.title} adicionado a lista, com sucesso`)
        const listsFetched = await listService.getListsByUserId(userId)

        setLists(listsFetched)
      } catch (error) {
        toast(`Erro ao adicionar ${tvShow.title} à lista!`)
        console.error(error)
      }
    },
    [userId],
  )

  const createList = useCallback(
    async (name: string) => {
      if (!userId) {
        toast("Erro ao cria lista!")
        return
      }

      try {
        await listService.createList(name, userId)
        const fetchedLists = await listService.getListsByUserId(userId)

        setLists(fetchedLists)
      } catch (error) {
        toast("Erro ao cria lista!")
        console.error(`Erro ao criar lista: ${error}`)
      }
    },
    [userId],
  )

  const deleteList = useCallback(
    async (listId: string) => {
      try {
        await listService.deleteList(listId)
        if (!userId) {
          toast("Erro ao buscar listas!")
          return
        }
        const fetchedLists = await listService.getListsByUserId(userId)

        setLists(fetchedLists)
      } catch (error) {
        toast("Erro ao excluir lista!")
        console.error(`Error ao remover lista: ${error}`)
      }
    },
    [userId],
  )

  const removeTvShowFromTheList = async ({
    listId,
    tvShow,
  }: {
    listId: string
    tvShow: TvShow
  }) => {
    if (!userId) {
      toast(`Erro ao remover ${tvShow.title} da lista`)
      return
    }

    try {
      await listService.removeTvShowFromTheList({
        listId,
        userId,
        tvShowId: tvShow.id,
      })

      const listsFetched = await listService.getListsByUserId(userId)

      setLists(listsFetched)
    } catch (error) {
      toast(`Erro ao adicionar ${tvShow.title} à lista!`)
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
      toast(`Erro ao atualizar a ordem da lista`)
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
    isLoading,
  }
}
