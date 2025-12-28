import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import "./profile.css"
import MyOrders from "./MyOrders"


export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    house: "",
    city: "",
    state: "",
    pincode: "",
    role: "user"
  })

  const [edit, setEdit] = useState(false)
  const [tab, setTab] = useState("profile") // profile | orders | address | shipper

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (data) setProfile(data)
  }

  async function save() {
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from("profiles").upsert({
      id: user.id,
      ...profile
    })

    alert("Profile updated")
    setEdit(false)
  }

  return (
    <div className="profile-container">

      {/* Sidebar */}
      <div className="profile-sidebar">

        <p className={tab==="profile" ? "active" : ""} onClick={()=>setTab("profile")}>
          👤 Profile
        </p>

        <p className={tab==="orders" ? "active" : ""} onClick={()=>setTab("orders")}>
          📦 My Orders
        </p>

        <p className={tab==="address" ? "active" : ""} onClick={()=>setTab("address")}>
          🏠 Address
        </p>

        {/* Show only for shippers */}
        {profile.role === "shipper" && (
          <p className={tab==="shipper" ? "active" : ""} onClick={()=>setTab("shipper")}>
            🚚 Shipper Dashboard
          </p>
        )}
      </div>

      {/* Main */}
      <div className="profile-main">

        {/* PROFILE */}
        {tab === "profile" && (
          <>
            <h2>Basic Details</h2>

            <div className="profile-row">
              <label>Name</label>
              <input
                disabled={!edit}
                value={profile.name || ""}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="profile-row">
              <label>Phone</label>
              <input
                disabled={!edit}
                value={profile.phone || ""}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>

            <div className="profile-row">
              <label>Role</label>
              <input disabled value={profile.role} />
            </div>

            {!edit ? (
              <button className="edit-btn" onClick={() => setEdit(true)}>
                Edit
              </button>
            ) : (
              <button className="save-btn" onClick={save}>
                Save
              </button>
            )}
          </>
        )}

        {/* ADDRESS */}
        {tab === "address" && (
          <>
            <h2>Shipping Address</h2>

            {["house", "city", "state", "pincode"].map(k => (
              <input
                key={k}
                value={profile[k] || ""}
                onChange={e => setProfile({ ...profile, [k]: e.target.value })}
                placeholder={k}
              />
            ))}

            <button className="save-btn" onClick={save}>
              Save
            </button>
          </>
        )}

        {/* USER ORDERS */}
        {tab === "orders" && <MyOrders />}

        {/* SHIPPER DASHBOARD */}
        {tab === "shipper" && profile.role === "shipper" && (
          <ShipperDashboard />
        )}

      </div>
    </div>
  )
}
