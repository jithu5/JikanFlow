import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "../App"
import { DashboardLanding, DashboardLayout, KanbanBoard, LandingPage } from "../pages/index"

function router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "",
          element: <LandingPage />
        }
      ],
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
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
    }
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default router
