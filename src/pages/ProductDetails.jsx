import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { addToCart } from "../cart"
import "./productDetails.css"

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [size, setSize] = useState("")
  const [wish, setWish] = useState(false)
  const [pin, setPin] = useState("")
  const [pinStatus, setPinStatus] = useState("")
  const [active, setActive] = useState(0)
  const [startX, setStartX] = useState(0)
  const [full, setFull] = useState(false)
  const [scale, setScale] = useState(1)

  useEffect(() => { load() }, [id])

  async function load() {
    const { data: p } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    setProduct(p)

    const { data: r } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", id)

    setReviews(r)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", id)

      setWish(data.length > 0)
    }
  }

  if (!product) return <p>Loading...</p>

  const images = product.images?.length ? product.images : [product.image]
  const total = images.length
  const out = product.stock <= 0

  function next() { setActive((active + 1) % total) }
  function prev() { setActive((active - 1 + total) % total) }

  function touchStart(e) {
    setStartX(e.touches[0].clientX)
  }

  function touchEnd(e) {
    const endX = e.changedTouches[0].clientX
    if (startX - endX > 50) next()
    if (endX - startX > 50) prev()
  }

  function checkPin() {
    if (pin.length !== 6) setPinStatus("Enter valid pincode")
    else if (pin.startsWith("5") || pin.startsWith("6")) setPinStatus("Delivery available")
    else setPinStatus("Delivery not available")
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

  async function toggleWish() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert("Login required")

    if (wish) {
      await supabase.from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", id)
      setWish(false)
    } else {
      await supabase.from("wishlist")
        .insert({ user_id: user.id, product_id: id })
      setWish(true)
    }
  }

  return (
    <div className="product-page">

      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="product-left">
        <div className="image-box image-wrapper">

          <button className="wish-btn" onClick={toggleWish}>
            {wish ? "❤️" : "🤍"}
          </button>

          {/* FIXED carousel click logic */}
          <div
            className="carousel"
            onTouchStart={touchStart}
            onTouchEnd={touchEnd}
            onClick={(e) => {
              if (e.target.tagName === "IMG") {
                setFull(true)
              }
            }}
          >
            <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
              {images.map((img, i) => (
                <img key={i} src={img} className="carousel-img" />
              ))}
            </div>

            <button className="nav prev" onClick={(e) => {
              e.stopPropagation()
              prev()
            }}>‹</button>

            <button className="nav next" onClick={(e) => {
              e.stopPropagation()
              next()
            }}>›</button>
          </div>

          <div className="thumb-row">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                className={active === i ? "active" : ""}
                onClick={() => setActive(i)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Fullscreen zoom */}
      {full && (
        <div className="fullscreen" onClick={() => setFull(false)}>
          <img src={images[active]} style={{ transform: `scale(${scale})` }} />
        </div>
      )}

      <div className="product-right">
        <h2>{product.name}</h2>
        <div className="price">₹{product.price}</div>

        {out && <p style={{ color: "red" }}>Out of stock</p>}

        <input value={pin} onChange={e => setPin(e.target.value)} placeholder="Enter pincode" />
        <button onClick={checkPin}>Check</button>
        <p>{pinStatus}</p>

        <div className="sizes">
          {["S", "M", "L", "XL"].map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={size === s ? "active-size" : ""}
            >
              {s}
            </button>
          ))}
        </div>

        <button disabled={out} onClick={() => requireLogin(() => addToCart(product))}>
          Add to Cart
        </button>

        <button disabled={out} onClick={() => requireLogin(() => {
          localStorage.setItem("buyNow", JSON.stringify([product]))
          navigate("/checkout")
        })}>
          Buy Now
        </button>

      </div>
    </div>
  )
}
