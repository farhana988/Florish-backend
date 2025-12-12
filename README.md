
# Florish (Node.js + Express + Prisma)
This is a complete backend system for a Plant E-commerce Platform, built using Node.js, Express.js, and Prisma ORM.
It includes authentication, plant management, orders, cart, wishlist, addresses, and role-based user management.

## Features
🔐 Authentication
 - User registration & login
- Get current user data
- Change password
- JWT authentication
 - Role-based access (User, Admin, Super Admin)

🌱 Plant Management
- Create, update, delete plants (Admin/Super Admin)
- Get all plants
- Get single plant

🛒 Cart Management
- Add to cart
- Update cart item quantity
- Remove item
- Clear cart
- Get user cart

💚 Wishlist Management
- Add to wishlist
- Remove wishlist item
- Clear wishlist
- Get user wishlist
📦 Order Management
- Create order
- Get user orders
- Get order details
- Confirm payment
- Admin: update order status
- Admin: cancel order

🏠 Address Management
- Add address
- Update address
- Delete address
- Get all user addresses

👥 User Management
- Register with file upload
- Update user info

👥 Super Admin:
- Get all users
- Block user
- Make admin

## 🛠️ Technology Stack
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation
- Multer (File Upload)

## 📁 Project Structure
```bash src/
 ├── modules/
 │    ├── auth/
 │    ├── user/
 │    ├── plant/
 │    ├── cart/
 │    ├── wishlist/
 │    ├── order/
 │    └── address/
 ├── middlewares/
 ├── helper/
 ├── app.ts
 └── server.ts 
```

## 🧪 Development & Running Locally

### Clone the Repository

```bash
https://github.com/farhana988/Florish-backend.git
cd Florish-backend
```

### Install Dependencies

```bash
npm install
```

### Create a .env file and add:

```bash
PORT=3000
NODE_ENV=Development / Production

DATABASE_URL=your_database_connection_string_here

CLOUDINARY_API_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key

# JWT
BCRYPT_SALT_ROUND=10

JWT_ACCESS_SECRET=your_jwt_secret_here
JWT_ACCESS_EXPIRES=15m

JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES=7d


SUPER_ADMIN_EMAIL=your_email
SUPER_ADMIN_PASSWORD=your_password
SUPER_ADMIN_NAME=Super Admin
```

### Run the Frontend

```bash
npm run dev
```