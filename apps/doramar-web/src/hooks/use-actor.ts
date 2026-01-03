import { useCallback } from "react"
import { useUser } from "./use-user"
import { actorService } from "@/services/actor.service "
import { toast } from "@/components/toast"

export function useActor() {
  const { user, setUser } = useUser()

  const userId = user?.id

  const markActorAsFavorite = useCallback(
    async (actorId: string) => {
      if (!userId) return

      try {
        return actorService.makeActorFavorite(userId, actorId).then((actor) => {
          if (!user) return

          if (!actor) {
            const updatedFavorites = user.favoriteActors.filter(
              (favActor) => favActor.id !== actorId,
            )

            setUser({
              ...user,
              favoriteActors: updatedFavorites,
            })

            toast("Ator removido dos favoritos!")
          } else {
            setUser({
              ...user,
              favoriteActors: [...user.favoriteActors, actor],
            })

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
  }
}
