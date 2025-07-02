import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "../App"
import {
  Auth,
  DashboardLanding,
  DashboardLayout,
  KanbanBoard,
  LandingPage
} from "../pages/index"
import { useEffect, useState, type JSX } from "react"
import useUserTokenStore from "@/store/userToken"
import AuthMiddleware from "@/AuthMiddleware/authMiddleware"
import { useFetchUserData } from "@/apiQuery/apiQuery"
import useUserStore from "@/store/user"

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { token, setToken } = useUserTokenStore()
  const { setUser } = useUserStore()
  const { data, error, isLoading: isUserLoading } = useFetchUserData(token);

  useEffect(() => {
    // ✅ Even safer (remove quotes manually if you're unsure)
    const localToken = localStorage.getItem("token")?.replace(/^"|"$/g, "");
    if (!token) {
      if (localToken) {
        setToken(localToken)
        setIsAuthenticated(true)
      } else {
        setToken("")
        setIsAuthenticated(false)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (token && !isUserLoading && !error) {
      console.log("User token ",data)
      setUser(data);
    }
  }, [isUserLoading,error])

  const ProtectedRoute = (element: JSX.Element) => (
    <AuthMiddleware isAuthenticated={isAuthenticated} isLoading={isLoading}>
      {element}
    </AuthMiddleware>
  )

  const router = createBrowserRouter([
    {
      path: "/",
      element: ProtectedRoute(<App />)
      ,
      children: [
        {
          path: "",
          element: <LandingPage />
        }
      ]
    },
    {
      path: "/dashboard",
      element: ProtectedRoute(<DashboardLayout />),
      children: [
        {
          path: "",
          element: <DashboardLanding />
        },
        {
          path: "kanban-board/:projectId",
          element: <KanbanBoard />
        }
      ]
    },
    {
      path: "/api/auth",
      element: <AuthMiddleware
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
      >
        <Auth />
      </AuthMiddleware>
    }
  ])

  return <RouterProvider router={router} />
}

export default AppRouter
