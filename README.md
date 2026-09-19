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
