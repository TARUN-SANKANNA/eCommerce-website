import { useState } from "react"
import { supabase } from "../supabase"
import "./auth.css"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function signup() {
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) alert(error.message)
    else alert("Check your email to verify your account!")

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>

        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={signup} disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p>
          Already have an account?
          <a href="/Login"> Login</a>
        </p>
      </div>
    </div>
  )
}
