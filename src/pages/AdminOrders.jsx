import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import "./adminOrders.css"

export default function AdminOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .not("status", "in", "(delivered,cancelled)")
      .order("created_at", { ascending: false })

    setOrders(data || [])
  }

  async function markShipped(id) {
    await supabase.from("orders").update({
      status: "shipped",
      shipped_at: new Date()
    }).eq("id", id)

    load()
  }

  async function markDelivered(id) {
    await supabase.from("orders").update({
      status: "delivered",
      delivered_at: new Date()
    }).eq("id", id)

    load()
  }

  return (
    <div className="admin-orders">
      <h2>📦 Orders Management</h2>

      {orders.map(o => (
        <div key={o.id} className="order-card">

          <h4>Order #{o.id}</h4>

          <p>
            Status:
            <span className={`status-badge status-${o.status}`}>
              {o.status}
            </span>
          </p>

          <p>Total: ₹{o.total}</p>

          <p>
            {o.shipping?.name}<br/>
            {o.shipping?.phone}<br/>
            {o.shipping?.house}, {o.shipping?.city}, {o.shipping?.state} - {o.shipping?.pincode}
          </p>

          {o.items.map((p,i)=>(
            <p key={i}>{p.name} × {p.qty || 1}</p>
          ))}

          {o.status === "pending" && (
            <button className="ship-btn" onClick={() => markShipped(o.id)}>
              Mark as Shipped
            </button>
          )}

          {o.status === "shipped" && (
            <button className="deliver-btn" onClick={() => markDelivered(o.id)}>
              Mark as Delivered
            </button>
          )}

        </div>
      ))}
    </div>
  )
}
