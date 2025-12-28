import { useEffect, useState } from "react"
import { supabase } from "../supabase"

export default function AdminAnalytics() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from("orders")
      .select("total, created_at")

    setOrders(data)

    let sum = 0
    data.forEach(o => sum += o.total)

    setTotal(sum)
    setCount(data.length)
  }

  return (
    <div style={{padding:40}}>
      <h2>📊 Sales Dashboard</h2>

      <div style={{display:"flex", gap:20}}>
        <div style={box}>
          <h3>Total Revenue</h3>
          <p>₹{total}</p>
        </div>

        <div style={box}>
          <h3>Total Orders</h3>
          <p>{count}</p>
        </div>

        <div style={box}>
          <h3>Average Order</h3>
          <p>₹{Math.round(total / count || 0)}</p>
        </div>
      </div>
    </div>
  )
}

const box = {
  background:"#f4f4f4",
  padding:30,
  borderRadius:10,
  minWidth:200
}
