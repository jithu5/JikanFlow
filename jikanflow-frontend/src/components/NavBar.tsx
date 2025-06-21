import { Link } from "react-router-dom"

function NavBar() {
  return (
    <>
          <nav className="bg-gray-900 text-white py-5 px-8 flex justify-between items-center shadow-md sticky top-0 z-50">
              <h1 className="text-3xl font-bold tracking-wide">JickenFlow</h1>
              <div className="space-x-8 text-lg">
                  <a href="#features" className="hover:text-blue-400 transition">Features</a>
                  <a href="#pricing" className="hover:text-blue-400 transition">Pricing</a>
                  <a href="#about" className="hover:text-blue-400 transition">About</a>
                  <a href="#contact" className="hover:text-blue-400 transition">Contact</a>
                  <Link to={"/dashboard"} className="hover:text-blue-400 transition">Dashboard</Link>
              </div>
          </nav> 
    </>
  )
}

export default NavBar
