import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import "./admin.css"

export default function Admin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    price: "",
    brand: "",
    type: "",
    category: "",
    gender: "",
    description: "",
    stock: "",
    images: []
  })

  useEffect(() => {
    loadProducts()
  }, [])


  
async function deleteUser(userId) {
  const res = await fetch(
    "https://YOUR_PROJECT_ID.supabase.co/functions/v1/delete-user",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    }
  )

  const data = await res.json()

  if (data.success) {
    alert("User deleted")
  } else {
    alert("Error deleting user")
  }
}

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    setProducts(data || [])
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleImages(e) {
    setForm({ ...form, images: [...e.target.files] })
  }

  async function uploadProduct() {
    if (!form.name || !form.price || !form.stock || !form.images.length) {
      alert("Fill all required fields")
      return
    }

    try {
      setLoading(true)
      const urls = []

      for (let file of form.images) {
        const name = `${Date.now()}-${file.name}`
        await supabase.storage.from("products").upload(name, file)
        const { data } = supabase.storage.from("products").getPublicUrl(name)
        urls.push(data.publicUrl)
      }

      await supabase.from("products").insert([{
        name: form.name,
        price: form.price,
        brand: form.brand,
        type: form.type,
        category: form.category,
        gender: form.gender,
        description: form.description,
        images: urls,
        stock: Number(form.stock),
        low_stock: Number(form.stock) <= 5
      }])

      alert("Product Added")
      setForm({
        name: "",
        price: "",
        brand: "",
        type: "",
        category: "",
        gender: "",
        description: "",
        stock: "",
        images: []
      })
      loadProducts()
    } catch (err) {
      alert("Upload failed")
    } finally {
      setLoading(false)
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return
    await supabase.from("products").delete().eq("id", id)
    loadProducts()
  }

  async function restock(id) {
    const qty = prompt("Enter new stock quantity")
    if (!qty) return

    await supabase.from("products").update({
      stock: qty,
      low_stock: qty <= 5
    }).eq("id", id)

    loadProducts()
  }

  return (
    <div className="admin-page">

      <h2>Add New Product</h2>

      <div className="admin-form glass">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" />
        <input name="type" value={form.type} onChange={handleChange} placeholder="Type (T-shirt, Shoes)" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Men</option>
          <option>Women</option>
          <option>Unisex</option>
        </select>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" />
        <input type="file" multiple onChange={handleImages} />

        <button className="glow-btn" onClick={uploadProduct} disabled={loading}>
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </div>

      <h2>All Products</h2>

      <div className="admin-list">
        {products.map(p => (
          <div key={p.id} className="admin-card glass">
            <img src={p.images?.[0]} />
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <p>Stock: {p.stock}</p>
            {p.low_stock && <p className="low">⚠ Low stock</p>}

            <div className="admin-actions">
              <button onClick={() => restock(p.id)}>Restock</button>
              <button onClick={() => deleteProduct(p.id)} className="danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
