import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import jsPDF from "jspdf"

export default function MyOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    setOrders(data)
  }

  async function cancelOrder(id) {
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", id)

    load()
  }

  function download(order) {
    const pdf = new jsPDF()

    pdf.text("Stay-Aura Invoice", 20, 20)
    pdf.text("Order ID: " + order.id, 20, 30)
    pdf.text("Total: ₹" + order.total, 20, 40)

    let y = 60
    order.items.forEach(p => {
      pdf.text(`${p.name}  ₹${p.price} x ${p.qty || 1}`, 20, y)
      y += 10
    })

    pdf.save("invoice_" + order.id + ".pdf")
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>My Orders</h2>

      {orders.map(o => (
        <div
          key={o.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10
          }}
        >
          <p>₹{o.total} — {o.status}</p>
            <button onClick={() => window.location = `/order/${o.id}`}>
  View Details
</button>

          <button onClick={() => download(o)}>
            Download Invoice
          </button>

          {o.status === "pending" && (
            <button
              onClick={() => cancelOrder(o.id)}
              style={{ marginLeft: 10, background: "red", color: "white" }}
            >
              Cancel Order
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
