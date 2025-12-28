import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabase"
import jsPDF from "jspdf"
import "./orderDetails.css"

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single()

    if (!error) setOrder(data)
  }

  if (!order) return <p>Loading...</p>

  function step(label, done) {
    return (
      <div className={`track-step ${done ? "done" : ""}`}>
        <span>{label}</span>
        {done && <span className="check">✔</span>}
      </div>
    )
  }

  function downloadInvoice() {
    const pdf = new jsPDF()

    pdf.text("Stay-Aura Invoice", 20, 20)
    pdf.text("Order ID: " + order.id, 20, 35)
    pdf.text("Total: ₹" + order.total, 20, 45)

    pdf.text("Customer:", 20, 60)
    pdf.text(order.shipping.name, 20, 70)
    pdf.text(order.shipping.phone, 20, 80)

    let y = 100
    pdf.text("Items:", 20, y)
    y += 10

    order.items.forEach(p => {
      pdf.text(`${p.name} × ${p.qty || 1} — ₹${p.price}`, 20, y)
      y += 10
    })

    pdf.save(`invoice_${order.id}.pdf`)
  }

  return (
    <div className="order-details">

      <h2>Order #{order.id}</h2>
      <p className={`status status-${order.status}`}>
        {order.status.toUpperCase()}
      </p>

      <h3>Tracking</h3>
      <div className="tracking-box">
        {step("Order Placed", true)}
        {step("Shipped", order.shipped_at)}
        {step("Delivered", order.delivered_at)}
      </div>

      <h3>Shipping Address</h3>
      <div className="address-box">
        <p>{order.shipping.name}</p>
        <p>{order.shipping.phone}</p>
        <p>
          {order.shipping.house}, {order.shipping.city},<br />
          {order.shipping.state} - {order.shipping.pincode}
        </p>
      </div>

      <h3>Products</h3>
      <div className="items-box">
        {order.items.map((p, i) => (
          <div key={i} className="item-row">
            <span>{p.name}</span>
            <span>{p.qty || 1} × ₹{p.price}</span>
          </div>
        ))}
      </div>

      <h2>Total: ₹{order.total}</h2>

      <button className="invoice-btn" onClick={downloadInvoice}>
        Download Invoice
      </button>

    </div>
  )
}
