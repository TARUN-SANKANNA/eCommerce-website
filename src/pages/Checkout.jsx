import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import { getCart } from "../cart"
import "./Order.css"

export default function Checkout() {
  const buyNow = JSON.parse(localStorage.getItem("buyNow"))
  const cart = buyNow || getCart()

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    house: "",
    city: "",
    state: "",
    pincode: ""
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAddress()
  }, [])

  async function loadAddress() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (data) {
      setAddress({
        name: data.name || "",
        phone: data.phone || "",
        house: data.house || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || ""
      })
    }
  }

  const total = cart.reduce((sum, p) => sum + p.price * (p.qty || 1), 0)

  async function proceedToPayment() {
    if (cart.length === 0) return alert("Your cart is empty")

    if (!address.name || !address.phone || !address.house || !address.city || !address.state || !address.pincode) {
      return alert("Please fill all address fields")
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert("Login required")

    // Save address
    await supabase.from("profiles").upsert({
      id: user.id,
      ...address
    })

    // 🔥 VERY IMPORTANT
    localStorage.setItem("checkout_items", JSON.stringify(cart))
    localStorage.setItem("shipping", JSON.stringify(address))

    window.location = "/Payment"
  }

  return (
    <div className="checkout">
      <h2>Shipping Address</h2>

      {Object.keys(address).map(key => (
        <input
          key={key}
          placeholder={key}
          value={address[key]}
          onChange={e => setAddress({ ...address, [key]: e.target.value })}
        />
      ))}

      <h3>Order Summary</h3>
      {cart.map(p => (
        <p key={p.id}>
          {p.name} × {p.qty || 1} — ₹{p.price * (p.qty || 1)}
        </p>
      ))}

      <h2>Total: ₹{total}</h2>

      <button onClick={proceedToPayment} disabled={loading}>
        {loading ? "Redirecting..." : "Proceed to Payment"}
      </button>
    </div>
  )
}
