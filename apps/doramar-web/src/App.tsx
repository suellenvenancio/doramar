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
import { ProtectedRoute } from "./components/protectedRoutes"
import { ProfilePage } from "./pages/profile"
import { useUser } from "./hooks/use-user"

export default function App() {
  
  return (
    <AuthProvider>
      <AppToastContainer />
      <AppRoutes />
    </AuthProvider>
  )
}

export function AppRoutes() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountComponent />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lists"
          element={
            <ProtectedRoute  >
              <ListsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list/:listId"
          element={
            <ProtectedRoute  >
              <ListsDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communities"
          element={
            <ProtectedRoute  >
              <CommunitiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communities/:communityId"
          element={
            <ProtectedRoute  >
              <CommunityDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute  >
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
