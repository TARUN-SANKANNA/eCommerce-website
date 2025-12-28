import { useState } from "react"
import { supabase } from "../supabase"

export default function Forgot() {
  const [email, setEmail] = useState("")

  async function reset() {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-password"
    })
    alert("Check your email")
  }

  return (
    <div className="login">
      <h3>Reset Password</h3>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <button onClick={reset}>Send Reset Link</button>
    </div>
  )
}
