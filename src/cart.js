export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || []
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart))
}

export function addToCart(product) {
  const cart = getCart()
  const item = cart.find(p => p.id === product.id)

  if (item) {
    item.qty += 1
  } else {
    cart.push({ ...product, qty: 1 })
  }

  saveCart(cart)
}

export function removeFromCart(id) {
  let cart = getCart().filter(p => p.id !== id)
  saveCart(cart)
}

export function updateQty(id, qty) {
  const cart = getCart()

  const item = cart.find(p => p.id === id)
  if (!item) return

  if (qty <= 0) {
    removeFromCart(id)
  } else {
    item.qty = qty
    saveCart(cart)
  }
}

export function clearCart() {
  localStorage.removeItem("cart")
}
