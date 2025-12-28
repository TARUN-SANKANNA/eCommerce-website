import { Link } from "react-router-dom"
import { supabase } from "../supabase"
import { useEffect, useState } from "react"
import "./navbar.css"

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState("user")

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        setRole(data.user.user_metadata?.role || "user")
      }
    })
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    window.location = "/"
  }

  return (
    <nav className="navbar">
      <h2>🛍 Stay-Aura</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {user && <Link to="/profile">Profile</Link>}
        {user && <Link to="/cart">Cart</Link>}

        {role === "admin" && <Link to="/admin">Products</Link>}
        {role === "admin" && <Link to="/admin/orders">Manage Orders</Link>}
        {role === "admin" && <Link to="/admin/stock">Stock Alerts</Link>}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  )
}
