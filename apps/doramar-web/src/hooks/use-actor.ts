import { use, useCallback, useEffect, useState } from "react"
import { useUser } from "./use-user"
import { actorService } from "@/services/actors.service "
import { toast } from "@/components/toast"
import { Actor } from "@/types"
import { set } from "zod"

export function useActor() {
  const { user, setUser } = useUser()
  const [favoriteActors, setFavoriteActors] = useState<Actor[]>([])

  const userId = user?.id

  const findFavoriteActorsByUserId = useCallback(
    async (userId: string) => {
      try {
        return await actorService.findFavoriteActorsByUserId(userId)
      } catch (e) {
        console.error(`Erro ao buscar atores favoritos: ${e}`)
        return []
      }
    },
    [userId],
  )

  useEffect(() => {
    if (!userId) return
    findFavoriteActorsByUserId(userId).then((actors) => {
      setFavoriteActors(actors)
    })
  }, [userId])

  const markActorAsFavorite = useCallback(
    async (actorId: string) => {
      if (!userId) return

      try {
        return actorService.makeActorFavorite(userId, actorId).then((actor) => {
          if (!user) return

          if (!actor) {
            const updatedFavorites = favoriteActors.filter(
              (favActor) => favActor.id !== actorId,
            )

            setFavoriteActors(updatedFavorites)

            toast("Ator removido dos favoritos!")
          } else {
            setFavoriteActors([...favoriteActors, actor])

            toast(`${actor.name} adicionado aos favoritos!`)
          }
        })
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
