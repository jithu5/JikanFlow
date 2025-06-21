import { Outlet } from "react-router-dom"
import SideBar from "./SideBar"

function DashboardLayout() {
  return (
    <>
          <div className="flex h-screen overflow-hidden">
              {/* Sidebar stays fixed and full height */}
              <SideBar />

              {/* Main content area scrolls independently */}
              <main className="flex-1 overflow-y-auto bg-gray-50">
                  <Outlet />
              </main>
          </div>
    </>
  )
}

export default DashboardLayout
