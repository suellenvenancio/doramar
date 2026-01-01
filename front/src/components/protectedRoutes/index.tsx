import type { User } from "@firebase/auth"
import type { ReactElement } from "react"
 import { Navigate } from "react-router-dom"

export function ProtectedRoute({
  user,
  children,
}: {
  user: User | null
  children: ReactElement
}) {
  if (!user) {
    return <Navigate to="/"   />
  }
  return children
}
