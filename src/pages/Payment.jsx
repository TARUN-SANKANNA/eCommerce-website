import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabase"
import { clearCart } from "../cart"

export default function Payment() {
  const [method, setMethod] = useState("cod")
  const [upi, setUpi] = useState("")
  const [card, setCard] = useState({ number:"", name:"", expiry:"", cvv:"" })
  const navigate = useNavigate()

  // 🔥 Get items from checkout
  const cart = JSON.parse(localStorage.getItem("checkout_items")) || []
  const shipping = JSON.parse(localStorage.getItem("shipping"))

  const total = cart.reduce((s,p)=>s+p.price*(p.qty||1),0)

  if(cart.length === 0){
    alert("Cart empty")
    navigate("/")
    return null
  }

  async function pay() {
    if(method==="upi" && !upi.includes("@")) return alert("Enter valid UPI")
    if(method==="card" && card.number.length < 16) return alert("Invalid card")

    const { data:{user} } = await supabase.auth.getUser()

    const { data } = await supabase.from("orders").insert([{
      user_id: user.id,
      items: cart,
      total,
      status: method==="cod" ? "pending" : "paid",
      payment_method: method,
      shipping
    }]).select().single()

    // cleanup
    localStorage.removeItem("checkout_items")
    localStorage.removeItem("shipping")
    localStorage.removeItem("buyNow")
    clearCart()

    navigate("/order/" + data.id)
  }

  return (
    <div className="payment">
      <h2>Select Payment</h2>

      <label><input type="radio" checked={method==="cod"} onChange={()=>setMethod("cod")}/> COD</label>
      <label><input type="radio" checked={method==="upi"} onChange={()=>setMethod("upi")}/> UPI</label>
      {method==="upi" && <input placeholder="UPI ID" value={upi} onChange={e=>setUpi(e.target.value)} />}

      <label><input type="radio" checked={method==="card"} onChange={()=>setMethod("card")}/> Card</label>
      {method==="card" && <>
        <input placeholder="Card Number" onChange={e=>setCard({...card,number:e.target.value})}/>
        <input placeholder="Name" onChange={e=>setCard({...card,name:e.target.value})}/>
        <input placeholder="MM/YY" onChange={e=>setCard({...card,expiry:e.target.value})}/>
        <input placeholder="CVV" onChange={e=>setCard({...card,cvv:e.target.value})}/>
      </>}

      <h3>Total: ₹{total}</h3>
      <button onClick={pay}>Pay & Place Order</button>
    </div>
  )
}
