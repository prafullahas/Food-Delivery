# BiteFlow 🍴

BiteFlow is a full-stack food delivery platform with separate customer and admin applications. It supports authentication, food management, cart operations, Stripe payments, server-side pricing, and order tracking.

## ✨ Features

### Customer
- User registration and login
- JWT-based authentication
- Browse food items by category
- Food availability indicators
- Add/remove items from cart
- Quantity management
- Checkout and Stripe payment
- Order history
- Order status tracking

### Admin
- Secure admin authentication
- Add, edit, and delete food items
- Toggle food availability
- View and search orders
- Filter orders by status
- Update order status
- Role-based access control

### Backend & Security
- JWT authentication
- bcrypt password hashing
- Role-based authorization
- Order ownership validation
- Server-side price calculation
- Food availability validation
- Protected admin endpoints
- Environment-based configuration
- Controlled CORS
- Automated backend tests

## 🛠️ Tech Stack

**Frontend:** React, Vite, Axios  
**Admin:** React, Vite, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas, Mongoose  
**Authentication:** JWT, bcrypt  
**Payments:** Stripe  
**Testing:** Vitest  
**Deployment:** Vercel, Render

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │     GitHub      │
                    │     master      │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
      ┌───────────────┐             ┌───────────────┐
      │    Vercel     │             │    Vercel     │
      │    Customer   │             │     Admin     │
      │    Frontend   │             │   Dashboard   │
      └───────┬───────┘             └───────┬───────┘
              │                             │
              └──────────────┬──────────────┘
                             ▼
                    ┌─────────────────┐
                    │     Render      │
                    │ Express Backend │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
             ┌────────────┐    ┌────────────┐
             │  MongoDB   │    │   Stripe   │
             │   Atlas    │    │  Payments  │
             └────────────┘    └────────────┘


⚙️ Local Setup
1. Clone the repository
git clone https://github.com/prafullahas/Food-Delivery.git
cd Food-Delivery/Food-Delivery
2. Backend
cd backend
npm install

Create a .env file using .env.example:
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
SALT=your_salt

Start the backend:
npm start
3. Customer Frontend
cd ../frontend
npm install

Create .env:
VITE_API_URL=http://localhost:4000

Start:
npm run dev
4. Admin
cd ../admin
npm install

Create .env:
VITE_API_URL=http://localhost:4000

Start:
npm run dev

🌐 Deployment
Component	Platform
Customer Frontend	Vercel
Admin Dashboard	Vercel
Backend API	Render
Database	MongoDB Atlas
Payments
