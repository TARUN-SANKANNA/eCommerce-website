import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import "./auth.css"

export default function UpdatePassword() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function setup() {
      const { data, error } = await supabase.auth.getSession()

      if (!data.session) {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSessionFromUrl({ storeSession: true })

        if (sessionError) {
          alert("Reset link expired. Please request again.")
          window.location = "/forgot-password"
          return
        }

        if (sessionData.session) setReady(true)
      } else {
        setReady(true)
      }
    }

    setup()
  }, [])

  async function updatePassword() {
    if (password.length < 6) return alert("Minimum 6 characters")

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      alert(error.message)
    } else {
      alert("Password updated successfully!")
      await supabase.auth.signOut()
      window.location = "/login"
    }

    setLoading(false)
  }

  if (!ready) return <p style={{ color: "white", textAlign: "center" }}>Verifying reset link...</p>

  return (
    <div className="login">
      <h2>Reset Password</h2>

      <div className="auth-card">
        <input
          type="password"
          placeholder="Enter new password"
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={updatePassword} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  )
}
