import { useCallback, useEffect, useState } from "react"

import { toast } from "@/components/toast"
import { actorService } from "@/services/actors.service "
import { Actor } from "@/types"

import { useUser } from "./use-user"

export function useActor() {
  const { user } = useUser()
  const [favoriteActors, setFavoriteActors] = useState<Actor[]>([])

  const userId = user?.id

  const findFavoriteActorsByUserId = useCallback(async (userId: string) => {
    try {
      return await actorService.findFavoriteActorsByUserId(userId)
    } catch (e) {
      console.error(`Erro ao buscar atores favoritos: ${e}`)
      return []
    }
  }, [])

  useEffect(() => {
    if (!userId) return
    findFavoriteActorsByUserId(userId).then((actors) => {
      setFavoriteActors(actors)
    })
  }, [findFavoriteActorsByUserId, userId])

  const markActorAsFavorite = useCallback(
    async (actorId: string) => {
      if (!userId) {
        toast("Erro ao marcar ator como favorito")
        return
      }

      try {
        const actor = await actorService.makeActorFavorite(userId, actorId)

        if (!actor) {
          setFavoriteActors((prev) => prev.filter((fav) => fav.id !== actorId))
          toast("Ator removido dos favoritos!")
        } else {
          setFavoriteActors((prev) => {
            const exists = prev.some((fav) => fav.id === actor.id)
            if (exists) return prev
            return [...prev, actor]
          })
          toast(`${actor.name} adicionado aos favoritos!`)
        }
      } catch (e) {
        console.error(`Erro salvar ator como favorito: ${e}`)
        toast("Erro ao atualizar favoritos.")
      }
    },
    [userId],
  )

  return {
    markActorAsFavorite,
    favoriteActors,
    findFavoriteActorsByUserId,
  }
}
