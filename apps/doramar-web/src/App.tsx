import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage } from "@/pages/login"
import { AuthProvider } from "@/context/auth.context"
import { HomePage } from "@/pages/home"
import { AppToastContainer } from "@/components/toast"
import { MyProfilePage } from "./pages/myProfile"
import { ListsPage } from "./pages/lists"
import { ListsDetailsPage } from "./pages/listDetails"
import { CommunitiesPage } from "./pages/communities"
import { CommunityDetails } from "./pages/communityDetails"
import { CreateAccountComponent } from "./pages/createAccount"
import { ForgotPassword } from "./pages/forgotPassword"
import { useEffect, useState } from "react"
import { auth } from "./firebase.config"
import type { User } from "@firebase/auth"
import { ProtectedRoute } from "./components/protectedRoutes"
import { ProfilePage } from "./pages/profile"
import { CircleIcon } from "./components/icons/circle"

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)  

 useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)  
  })

  return () => unsubscribe() 
  }, [])


  if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <CircleIcon className="h-12 w-12 text-pink-600" />
    </div>
  )
  }
  
  return (
    <AuthProvider>
      <AppToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccountComponent />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute user={user}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lists"
            element={
              <ProtectedRoute user={user}>
                <ListsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list/:listId"
            element={
              <ProtectedRoute user={user}>
                <ListsDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/communities"
            element={
              <ProtectedRoute user={user}>
                <CommunitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/communities/:communityId"
            element={
              <ProtectedRoute user={user}>
                <CommunityDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute user={user}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
