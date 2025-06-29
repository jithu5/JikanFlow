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
import useUserStore from "@/store/user"
import AuthMiddleware from "@/AuthMiddleware/authMiddleware"

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { token, setToken } = useUserStore()

  useEffect(() => {
    const localToken = localStorage.getItem("token")
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
          path: "kanban-board",
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
