import { useState } from "react"
import { supabase } from "../supabase"
import "./auth.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function login() {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      window.location = "/"
    }

    setLoading(false)
  }

  return (
    <div className="login">
      <h2>Login</h2>

      <div className="auth-card">
        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          className="google-btn"
          onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
        >
          Continue with Google
        </button>
         <p>
  <a href="/forgot-password">Forgot password?</a>
</p>

        <p>
          New user? <a href="/Signup">Create Account</a>
        </p>
      </div>
    </div>
  )
}
