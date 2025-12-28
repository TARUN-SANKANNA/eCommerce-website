import { useState } from "react"
import { supabase } from "../supabase"
import "./auth.css"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function sendLink() {
    if (!email.includes("@")) return alert("Enter valid email")

    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/update-password"
    })

    if (error) {
      alert(error.message)
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  return (
    <div className="login">
      <h2>Reset Password</h2>

      <div className="auth-card">

        {!sent ? (
          <>
            <input
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <button onClick={sendLink} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        ) : (
          <div className="success-box">
            <h3>📩 Check your email</h3>
            <p>We’ve sent you a password reset link.</p>
          </div>
        )}

      </div>
    </div>
  )
}
