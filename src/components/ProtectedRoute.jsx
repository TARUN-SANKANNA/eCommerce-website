import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../supabase"

export default function ProtectedRoute({ children, adminOnly }) {
  const [allowed, setAllowed] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user
      const role = user?.user_metadata?.role || "user"

      if (!user) return setAllowed(false)
      if (adminOnly && role !== "admin") return setAllowed(false)

      setAllowed(true)
    })
  }, [])

  if (allowed === null) return <p>Loading...</p>
  if (!allowed) return <Navigate to="/login" replace />

  return children
}
