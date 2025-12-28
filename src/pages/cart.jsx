import { getCart, removeFromCart, updateQty, clearCart } from "../cart"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Cart() {
  const [cart, setCart] = useState(getCart())
  const navigate = useNavigate()

  function refresh() {
    setCart(getCart())
  }

  const total = cart.reduce((s,p)=>s + p.price * p.qty,0)

  return (
    <div className="cart">
      <h2>Your Cart</h2>

      {cart.length === 0 && <p>Your cart is empty</p>}

      {cart.map(p => (
        <div key={p.id} className="cart-item">

          <h4>{p.name}</h4>

          <div className="qty-box">
            <button onClick={() => { updateQty(p.id, p.qty - 1); refresh() }}>−</button>
            <span>{p.qty}</span>
            <button onClick={() => { updateQty(p.id, p.qty + 1); refresh() }}>+</button>
          </div>

          <p>₹{p.price * p.qty}</p>

          <button onClick={() => { removeFromCart(p.id); refresh() }}>
            Remove
          </button>

        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h3>Total: ₹{total}</h3>

          <button onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>

          <button style={{background:"crimson"}} onClick={() => {
            if(confirm("Clear cart?")){
              clearCart()
              refresh()
            }
          }}>
            Empty Cart
          </button>
        </>
      )}
    </div>
  )
}
