import { useCallback, useContext } from "react"
import { AuthContext } from "@/context/auth.context"
import { userService } from "@/services/user.service"
import { toast } from "@/components/toast"
import type { TvShow } from "@/types"
import { AuthService } from "@/services/auth.service"
import { auth } from "@/firebase.config"

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }

  return context
}

export function useUser() {
  const { user, setUser, login } = useAuthContext()

  const markTvShowAsFavorite = useCallback(
    async (tvShow: TvShow) => {
      try {
        if (!user) return

        await userService
          .addTVShowToFavorites(user.id, tvShow.id)
          .then((updatedUser) => {
            const tvShowRemovedOrAdded = updatedUser.favoriteTvShow
              ? "adicionado "
              : "removido"

            setUser(updatedUser)
            toast(`${tvShow.title} ${tvShowRemovedOrAdded} como favorito!`)
          })
          .catch(() => toast(`Erro ao adicionar ${tvShow.title} como favorito`))
      } catch (error) {
        console.error("Erro ao marcar dorama como favorito", error)
      }
    },
    [user, setUser]
  )

  const createAccount = async ({
    email,
    name,
    password,
    username,
  }: {
    email: string
    name: string
    password: string
    username: string
  }) => {
    try {
      const authService = new AuthService(auth)
      await authService.createAccount(email, password)
      await userService.createUser({
        name: name,
        email: email,
        username: username,
      })
    } catch (error) {
      console.error("Erro ao criar usuário", error)
    }
  }

  const uploadProfilePicture = async (formData: FormData) => {
    try {
      const userId = user?.id
      if (!userId) return
      await userService
        .uploadProfilePicture({ userId, formData })
        .then((newUser) => setUser(newUser))
        .catch(() => toast("erro ao fazer upload da foto!"))
    } catch (error) {
      console.error("Erro ao atualiza foto do usuário", error)
    }
  }

  const findUserById = async (userId: string) => {
    try {
      return await userService.findUserById(userId)
    } catch (error) {
      console.error("Erro ao buscar usuário", error)
    }
  }

  const findUserByUsername = useCallback(async (username: string) => {
    try {
      return await userService.findUserByUsername(username)
    } catch (error) {
      console.error("Erro ao buscar usuário", error)
      return null
    }
  }, [])

  const findUserByEmail = useCallback(async (email: string) => {
    try {
      return await userService.findUserByEmail(email)
    } catch (error) {
      console.error("Erro ao buscar usuário", error)
      return null
    }
  }, [])

  return {
    user,
    setUser,
    markTvShowAsFavorite,
    login,
    createAccount,
    uploadProfilePicture,
    findUserById,
    findUserByUsername,
    findUserByEmail,
  }
}
