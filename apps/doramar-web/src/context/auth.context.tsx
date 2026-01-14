"use client";

import {
  createContext,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
} from "react"
import type { User } from "@/types"
import { userService } from "@/services/user.service"
import { AuthService } from "@/services/auth.service"
import { auth } from "@/firebase.config"
import Cookies from "js-cookie"

export interface IAuthContextData {
  login: (email: string, password: string) => Promise<User | null>
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}

interface IProviderData {
  children: ReactNode
}

export const AuthContext = createContext<IAuthContextData | undefined>(
  undefined,
)

export function AuthProvider({ children }: IProviderData) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
   
      if (firebaseUser) {
        const userData = await userService.findUserByEmail(firebaseUser.email!)
        Cookies.set("appToken", await firebaseUser.getIdToken())
        setUser(userData)
      } else {
        setUser(null)
        Cookies.remove("appToken")
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [setIsLoading])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const authService = new AuthService(auth)
      await authService.signIn(email, password).then(async (userCredential) => {
        const userData = await userService.findUserByEmail(email)

        const token = await userCredential.user.getIdToken()
        Cookies.set("appToken", token, { expires: 7 })
        setUser(userData)
      })
      return user
    } catch (error) {
       setUser(null)
      throw new Error("Error on get the user")
    }
  }, [])

  return (
    <AuthContext.Provider value={{ login, user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
