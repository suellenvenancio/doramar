import { useUser } from "@/hooks/use-user"
import type { ReactElement } from "react"
import { Navigate } from "react-router-dom"
import { CircleIcon } from "../icons/circle"

export function ProtectedRoute({
  children,
}: {
  children: ReactElement
  }) { 
  const { user, isLoading } = useUser()

  if (isLoading) {
    return  (<div className="flex flex-col items-center justify-center w-full py-24">
    <CircleIcon className="h-12 w-12 text-pink-600" /> 
  </div>)
  }

  if (!user) {
    return <Navigate to="/" />
  }
  return children
}
