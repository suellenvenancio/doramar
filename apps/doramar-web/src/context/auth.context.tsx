import { createContext, useState, useCallback, type ReactNode, useEffect } from "react"
import type { User } from "@/types"
import { userService } from "@/services/user.service"
import { AuthService } from "@/services/auth.service"
import { auth } from "@/firebase.config"
import { useNavigate } from "react-router-dom"
import { CircleIcon } from "@/components/icons/circle"
 
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
  undefined
)

export function AuthProvider({ children }: IProviderData) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log(firebaseUser)
       if (firebaseUser) { 
        const userData = await userService.findUserByEmail(firebaseUser.email!)
        setUser(userData)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [setIsLoading])

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
    <AuthContext.Provider value={{ login, user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
