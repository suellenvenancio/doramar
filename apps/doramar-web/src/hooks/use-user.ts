import { useCallback, useContext } from "react"
import { AuthContext } from "@/context/auth.context"
import { userService } from "@/services/user.service"
import { toast } from "@/components/toast"

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }

  return context
}

export function useUser() {
  const { user, setUser, login, isLoading } = useAuthContext()

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
      await userService.createUser({
        name: name,
        email: email,
        username: username,
        password: password,
      })
    } catch (error) {
      console.error("Erro ao criar usuário", error)
    }
  }

  const uploadProfilePicture = async (formData: FormData) => {
    try {
      const userId = user?.id
      if (!userId) {
        toast("erro ao fazer upload da foto!")
        return
      }
      const newUser = await userService.uploadProfilePicture({
        userId,
        formData,
      })
      setUser(newUser)
    } catch (error) {
      toast("erro ao fazer upload da foto!")
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
    login,
    createAccount,
    uploadProfilePicture,
    findUserById,
    findUserByEmail,
    isLoading,
  }
}
