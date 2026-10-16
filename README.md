# 🍅 Tomato - Full Stack Food Delivery Platform

A full-stack food ordering and delivery web application built with the MERN stack and integrated with Stripe payment processing.

## 🚀 Features

- **Customer Web App:**
  - Dynamic category-based dish filtering (Salads, Rolls, Desserts, Pasta, etc.).
  - Cart state management with real-time subtotal and delivery charge calculations.
  - JWT user authentication (Sign Up / Sign In / Sign Out).
  - Stripe Sandbox Checkout integration for card payments.
  - Live order tracking and order history dashboard.

- **Admin Panel:**
  - Multi-page dashboard to add, list, and delete food items with Multer image uploads.
  - Real-time order management to update delivery stages (`Food Processing` → `Out for delivery` → `Delivered`).

- **Backend REST API:**
  - Express.js server with MongoDB Atlas models via Mongoose.
  - Secure bcrypt password hashing and token-based protected routes.

---

## 🛠️ Tech Stack

- **Frontend & Admin:** React.js, Vite, React Router Dom, Context API, Axios
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose
- **Authentication & Security:** JWT (JSON Web Tokens), Bcrypt.js, Validator
- **Payment Gateway:** Stripe API
- **File Uploads:** Multer

---

## 📂 Project Structure

```text
food-del/
├── backend/       # Express REST API, MongoDB models & routes
├── frontend/      # Customer food delivery client (React)
└── admin/         # Restaurant owner dashboard (React)