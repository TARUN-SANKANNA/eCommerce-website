import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import Navbar from "./components/NavBar"
import ProtectedRoute from "./components/ProtectedRoute"
import ForgotPassword from "./pages/ForgotPassword"
import UpdatePassword from "./pages/UpdatePassword"




/* Lazy load all pages */
const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Signup = lazy(() => import("./pages/Signup"))
const Cart = lazy(() => import("./pages/cart"))
const MyOrders = lazy(() => import("./pages/MyOrders"))
const Admin = lazy(() => import("./pages/Admin"))
const Checkout = lazy(() => import("./pages/Checkout"))
const AdminOrders = lazy(() => import("./pages/AdminOrders"))
const Profile = lazy(() => import("./pages/Profile"))
const OrderDetails = lazy(() => import("./pages/OrderDetails"))
const ProductDetails = lazy(() => import("./pages/ProductDetails"))
const AdminStock = lazy(() => import("./pages/AdminStock"))
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"))
const Payment = lazy(() => import("./pages/Payment"))

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense fallback={<div className="page-loader">Loading…</div>}>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/update-password" element={<UpdatePassword />} />
          {/* User */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />

<Route
  path="/payment"
  element={
    <ProtectedRoute>
      <Payment />
    </ProtectedRoute>
  }
/>



          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />

          <Route path="/order/:id" element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          } />

          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly={true}>
              <AdminOrders />
            </ProtectedRoute>
          } />

          <Route path="/admin/stock" element={
            <ProtectedRoute adminOnly={true}>
              <AdminStock />
            </ProtectedRoute>
          } />

          <Route path="/admin/analytics" element={
            <ProtectedRoute adminOnly={true}>
              <AdminAnalytics />
            </ProtectedRoute>
          } />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
