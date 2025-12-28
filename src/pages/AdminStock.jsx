import { useEffect, useState } from "react"
import { supabase } from "../supabase"

export default function AdminStock() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("low_stock", true)

    setProducts(data)
  }

  async function restock(id) {
    const qty = prompt("Enter new stock")
    if (!qty) return

    await supabase.from("products").update({
      stock: qty,
      low_stock: false
    }).eq("id", id)

    load()
  }

  return (
    <div style={{padding:30}}>
      <h2>🚨 Out of Stock Products</h2>

      {products.map(p => (
        <div key={p.id} style={{border:"1px solid #ccc", padding:10, marginBottom:10}}>
          <b>{p.name}</b> — Stock: {p.stock}
          <button onClick={() => restock(p.id)}>Restock</button>
        </div>
      ))}
    </div>
  )
}
