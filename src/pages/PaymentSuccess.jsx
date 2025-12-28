import { useEffect } from "react"
import { supabase } from "../supabase"
import "./success.css"

export default function PaymentSuccess() {

  useEffect(() => {
    async function save() {
      const cart = JSON.parse(localStorage.getItem("checkout_cart"))
      const address = JSON.parse(localStorage.getItem("checkout_address"))
      const { data:{user} } = await supabase.auth.getUser()

      const total = cart.reduce((s,p)=>s+p.price*p.qty,0)

      await supabase.from("orders").insert({
        user_id: user.id,
        items: cart,
        total,
        shipping: address,
        status: "paid",
        payment_method: "fake"
      })

      localStorage.removeItem("checkout_cart")
      localStorage.removeItem("checkout_address")
      localStorage.removeItem("cart")
    }

    save()
  }, [])

  return (
    <div className="success-page">
      <div className="tick">✔</div>
      <h2>Payment Successful</h2>
      <p>Your order has been placed</p>

      <a href="/orders" className="btn">View My Orders</a>
    </div>
  )
}
