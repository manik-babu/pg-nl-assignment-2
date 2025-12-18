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
│   │   └── express
│   │       └── express.d.ts
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
git clone https://github.com/manik-babu/pg-nl-assignment-2.git
```
### 2. Navigate to the folder
```bash
cd pg-nl-assignment-2
```
### 4. Install dependencies
```bash
npm install
```
### 5. Create a .env file
Inside the project root create a `.env` file.
And set the following environment variables
```
PORT=8080
CONNECTING_STR=[PostgreSQL connecting string]
JWT_SECRET=[Put here a jwt secret]
```
### 6. Run the server
Run the server by the following command
```bash
npm run dev
```
---

# 🌐 Usage Instructions & API Reference

Complete API reference for the Vehicle Rental System with request body example.

---

## 🔐 Authentication Endpoints

### 1. User Registration

**Description:** Register a new user account

#### Endpoint
```
POST /api/v1/auth/signup
```

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}
```
---

### 2. User Login

**Description:** Login to account

#### Endpoint
```
POST /api/v1/auth/signin
```

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```
---

## 🚗 Vehicle Endpoints

### 3. Create Vehicle

**Description:** Add a new vehicle to the system

#### Endpoint
```
POST /api/v1/vehicles
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

---

### 4. Get All Vehicles

**Description:** Retrieve all vehicles in the system

#### Endpoint
```
GET /api/v1/vehicles
```

---

### 5. Get Vehicle by ID

**Description:** Retrieve specific vehicle details

#### Endpoint
```
GET /api/v1/vehicles/:vehicleId
```

**Example:**
```
GET /api/v1/vehicles/2
```
---

### 6. Update Vehicle

**Description:** Update vehicle details, price, or availability status

#### Endpoint
```
PUT /api/v1/vehicles/:vehicleId
```

**Example:**
```
PUT /api/v1/vehicles/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body (All fields optional)
```json
{
  "vehicle_name": "Toyota Camry 2024 Premium",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 55,
  "availability_status": "available"
}
```
---

### 7. Delete Vehicle

**Description:** Delete a vehicle (only if no active bookings exist)

#### Endpoint
```
DELETE /api/v1/vehicles/:vehicleId
```

**Example:**
```
DELETE /api/v1/vehicles/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```
---

## 👥 User Endpoints

### 8. Get All Users

**Description:** Retrieve all users in the system

#### Endpoint
```
GET /api/v1/users
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

---

### 9. Update User

**Description:** Admin can update any user's role or details. Customer can update own profile only

#### Endpoint
```
PUT /api/v1/users/:userId
```

**Example:**
```
PUT /api/v1/users/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body (All fields optional)
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567899",
  "role": "admin"
}
```

---

### 10. Delete User

**Description:** Delete a user (only if no active bookings exist)

#### Endpoint
```
DELETE /api/v1/users/:userId
```

**Example:**
```
DELETE /api/v1/users/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```
---

## 📅 Booking Endpoints

### 11. Create Booking

**Description:** Create a new booking with automatic price calculation and vehicle status update

#### Endpoint
```
POST /api/v1/bookings
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```
---

### 12. Get All Bookings

**Description:** Retrieve bookings based on user role

#### Endpoint
```
GET /api/v1/bookings
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```
---

### 13. Update Booking

**Description:** Update booking status based on user role and business rules

#### Endpoint
```
PUT /api/v1/bookings/:bookingId
```

**Example:**
```
PUT /api/v1/bookings/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body - Customer Cancellation
```json
{
  "status": "cancelled"
}
```

#### Request Body - Admin Mark as Returned
```json
{
  "status": "returned"
}
```

---

## 🔒 Authentication Header Format

All protected endpoints require the following header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```