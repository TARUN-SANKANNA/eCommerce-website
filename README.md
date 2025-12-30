
<p align="center">
  <img 
    src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:22c55e&height=280&section=header&text=eCommerce%20Website&fontSize=50&fontColor=ffffff&desc=Modern%20Full-Stack%20Clothing%20Store%20Built%20with%20React%20%2B%20Supabase&descAlignY=65&animation=fadeIn" 
    width="100%"
  />
</p>

## 🛒 eCommerce-website

A modern full-stack eCommerce web application built with React, Supabase, and Stripe-ready architecture that allows users to browse products, add them to cart, place orders, and manage their profiles.
Admins can manage products, track orders, and control inventory

![GitHub repo size](https://img.shields.io/github/repo-size/TARUN-SANKANNA/eCommerce-website)
![GitHub stars](https://img.shields.io/github/stars/TARUN-SANKANNA/eCommerce-website?style=social)
![GitHub forks](https://img.shields.io/github/forks/TARUN-SANKANNA/eCommerce-website?style=social)
![GitHub issues](https://img.shields.io/github/issues/TARUN-SANKANNA/eCommerce-website)
![GitHub license](https://img.shields.io/github/license/TARUN-SANKANNA/eCommerce-website)

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)
![Netlify](https://img.shields.io/badge/Hosted_on-Netlify-brightgreen?logo=netlify)
![Stripe](https://img.shields.io/badge/Payments-Fake%20Demo-orange)



## 🔗 Live Demo  
🚀 **eCommerce-website**  
👉 https://stay-aura.netlify.app
<br><br>

## 🚀 Features 

>👤 User
- Signup & Login (Supabase Authentication)
- Profile & Address Management
- Add to Cart & Buy Now
- Checkout Flow
- Order Tracking
- Download Invoice (PDF)
- Secure Logout

>🛍 Shopping
- Product Listing
- Product Details Page
- Image Gallery
- Stock Management
- Low-stock alerts
- Quantity control

 >📦 Orders
- Place Orders
- Order History
- Order Status (Pending → Shipped → Delivered)
- Address stored per order

>🧑‍💻 Admin Panel
- Add / Edit / Delete Products
- Manage orders
- Update Order status
- Stock alerts
- Analytics Dashboard

<br><br>


  ## 🧰 Tech Stack

| Layer          | Technology             |
|----------------|------------------------|
| Frontend       | React, Vite            |
| Backend        | Supabase               |
| Database       | PostgreSQL (Supabase)  |
| Authentication | Supabase Auth          |
| Storage        | Supabase Storage       |
| PDF            | jsPDF                  |
| Hosting        | Netlify                |
| Styling        | CSS + Animations       |

<br><br>
## 📁 Project Structure

<details>
  <summary>Click to expand</summary>
  eCommerce-website/ <br>
  │  <br>
  ├── src/ <br>
  │   ├── components/  <br>
  │   ├── pages/ <br>
  │   ├── supabase.js  <br> 
  │   ├── cart.js <br
  │   └── App.jsx <br>
  │  <br>
  ├── public/ <br>
  ├── README.md <br>
  └── package.json
</details>


<br><br>
## 🛠 Setup Instructions <br>
1. Clone the Repository 
  >git clone https://github.com/TARUN-SANKANNA/eCommerce-website   <br>
  >cd eCommerce-website 

2. Install Dependencies
    >npm install
3. Setup Supabase
    >VITE_SUPABASE_URL=your_url   <br>
    >VITE_SUPABASE_ANON_KEY=your_key

4. Run Locally
   >npm run dev

<br><br>

## 🧑‍💻 Admin Access

Admins are identified using Supabase user_metadata.role = "admin"   <br>

You can assign admin in Supabase SQL:

>update auth.users <br>
set raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"admin"', true)  <br>
where email = 'your@email.com';

<br><br>

## 📦 Deployment

<h4>Deployed using Netlify </h4>  <br>

Build folder:
- dist

<br>
Netlify Redirects:
>/*    /index.html   200


<br><br>

##📄 License<br>

<h3>This project is open-source and free to use for learning and development.</h3>

<br><br>

##✨ Author
<h2>Tarun Sankanna</h2>
<br><br>

