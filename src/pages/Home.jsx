import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import "../pages/Home.css"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState("")
  const [brand, setBrand] = useState("all")
  const [type, setType] = useState("all")
  const [brands, setBrands] = useState([])
  const [types, setTypes] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*")
    setProducts(data)

    setBrands([...new Set(data.map(p => p.brand).filter(Boolean))])
    setTypes([...new Set(data.map(p => p.type).filter(Boolean))])
  }

  async function requireLogin(action) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert("Please login to continue")
      navigate("/login")
      return
    }
    action()
  }

  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "all" || p.category === category) &&
    (brand === "all" || p.brand === brand) &&
    (type === "all" || p.type === type)
  )

  if (sort === "low") filtered.sort((a, b) => a.price - b.price)
  if (sort === "high") filtered.sort((a, b) => b.price - a.price)

  function countBrand(b) {
    return products.filter(p => p.brand === b).length
  }

  return (
    <div className="shop-layout">

      {/* Mobile Filter Button */}
      <button className="mobile-filter-btn" onClick={() => setShowFilters(true)}>
        ☰ Filters
      </button>

      {/* Filters */}
      <div className={`filters-panel ${showFilters ? "open" : ""}`}>
        <h3>Filters</h3>

        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select onChange={e => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

        <h4>Brand</h4>
        {brands.map(b => (
          <label key={b}>
            <input
              type="radio"
              name="brand"
              onChange={() => setBrand(b)}
            />
            {b} ({countBrand(b)})
          </label>
        ))}
        <label>
          <input type="radio" name="brand" onChange={() => setBrand("all")} /> All
        </label>

        <h4>Type</h4>
        {types.map(t => (
          <label key={t}>
            <input
              type="radio"
              name="type"
              onChange={() => setType(t)}
            />
            {t}
          </label>
        ))}
        <label>
          <input type="radio" name="type" onChange={() => setType("all")} /> All
        </label>

        <h4>Sort By</h4>
        <select onChange={e => setSort(e.target.value)}>
          <option value="">None</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>

        <button onClick={() => setShowFilters(false)}>Apply</button>
      </div>

      {/* Products */}
      <div className="grid">
        {filtered.map(p => (
          <div key={p.id} className="card">

            <img src={p.image} onClick={() => navigate(`/product/${p.id}`)} />

            <h3 onClick={() => navigate(`/product/${p.id}`)}>
              {p.name}
            </h3>

            <p>₹{p.price}</p>

            {p.stock <= 5 && p.stock > 0 && <p className="low">Only {p.stock} left</p>}
            {p.stock === 0 && <p className="out">Out of stock</p>}

           

          </div>
        ))}
      </div>

    </div>
  )
}
