import { createContext, useState, useCallback, type ReactNode } from "react"
import type { User } from "@/types"
import { userService } from "@/services/user.service"
import { AuthService } from "@/services/auth.service"
import { auth } from "@/firebase.config"

export interface IAuthContextData {
  login: (email: string, password: string) => Promise<User | null>
  user: User | null
  setUser: (user: User | null) => void
}

interface IProviderData {
  children: ReactNode
}

export const AuthContext = createContext<IAuthContextData | undefined>(
  undefined
)

export function AuthProvider({ children }: IProviderData) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    try {
      const authService = new AuthService(auth)
      await authService.signIn(
          email,
          password
      ).then(async(userCredential) => {
        const userData = await userService.findUserByEmail(email)
        localStorage.setItem("appToken", await userCredential.user.getIdToken())
        setUser(userData)
      })
     
      return user
    } catch (error) {
      console.error("Login error:", error)
      setUser(null)
      localStorage.removeItem("appToken")
      throw new Error("Error on get the user")
    }
  }, [])

  return (
    <AuthContext.Provider value={{ login, user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
