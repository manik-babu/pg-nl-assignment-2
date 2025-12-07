# 🚗 Vehicle Rental System

## Live deployment link
```
https://pg-assignment-2.vercel.app
```

## 🚀 Features

A backend API for a vehicle rental management system that handles:
- **Vehicles** - Manage vehicle inventory with availability tracking
- **Customers** - Manage customer accounts and profiles
- **Bookings** - Handle vehicle rentals, returns and cost calculation
- **Authentication** - Secure role-based access control (Admin and Customer roles)

---

## 🛠️ Technology Stack

- **Node.js** + **TypeScript**
- **Express.js** (web framework)
- **PostgreSQL** (database)
- **bcrypt** (password hashing)
- **jsonwebtoken** (JWT authentication)

---

## 📂 Project Structure
```
ASSIGNMENT-2/
├── node_modules/
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   └── index.ts
│   │
│   ├── middleware/
│   │   └── auth.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   │
│   │   ├── booking/
│   │   │   ├── booking.controller.ts
│   │   │   ├── booking.routes.ts
│   │   │   └── booking.service.ts
│   │   │
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.service.ts
│   │   │
│   │   └── vehicle/
│   │       ├── vehicle.controller.ts
│   │       ├── vehicle.routes.ts
│   │       └── vehicle.service.ts
│   │
│   ├── types/
│   │   └── express.d.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

## 🏁 Run the Project
### 1. Clone the repository  
```bash
git clone https://github.com/manik-babu/pg-assignment-2.git
```
### 2. Navigate to the folder
```bash
cd pg-assignment-2
```
### 4. Install dependencies
```bash
npm install
```
### 5. Create a .env file
Inside the project root create a `.env` file
```
PORT=8080
CONNECTING_STR=[PostgreSQL connecting string]
JWT_SECRET=[Put here a jwt secret]
```
### 6. Run the server
Use tsx npm package to autorun the server on save
```bash
npm run dev
```