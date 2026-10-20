# PS7 Shop Inventory & Stock Management System

A beginner-friendly full-stack MERN (MongoDB Atlas, Express.js, React.js with Vite, Node.js) web application designed for small shop owners and staff to manage products, suppliers, restocks (Stock-In), retail sales (Stock-Out), low-stock alerts, and daily business performance analytics.

---

## 1. Problem Statement & Description

Small retail stores and shops frequently encounter issues such as stock-outs during peak hours, dead stock tied up in storage, lack of visibility into daily sales profit, and errors resulting from manual paper registers. 

The **Shop Inventory & Stock Management System** solves this by providing:
- Role-based workflows (Admin vs. Staff).
- Atomic stock transactions to avoid race conditions and negative inventory.
- Real-time audit logs of every Stock-In (purchases from suppliers) and Stock-Out (sales to customers).
- Instant low-stock warning banners when quantities hit or fall below reorder thresholds.
- Executive dashboard with auto-calculated total inventory valuation, today's sales revenue, and gross profit.

---

## 2. Technology Stack

- **Frontend:** React.js (Vite), React Router v6, Pure CSS Design System (Custom variables, responsive grid).
- **Backend:** Node.js, Express.js (REST API architecture).
- **Database:** MongoDB Atlas with Mongoose ODM.
- **Authentication & Security:** JSON Web Tokens (JWT), bcrypt.js password hashing, role-based authorization middleware (`admin` and `staff`), CORS policy.
- **Client Requests:** Standard JavaScript Fetch API organized in dedicated modular API services.

---

## 3. Folder Structure

```text
Shop Inventory & Stock Management System/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection logic
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile, admin creation
│   │   ├── productController.js   # Product CRUD & stock history retrieval
│   │   ├── supplierController.js  # Supplier CRUD & dependency protection
│   │   ├── stockController.js     # Atomic Stock-In, Stock-Out & Low-Stock queries
│   │   └── dashboardController.js # Aggregated analytics (valuation, sales, profit)
│   ├── middleware/
│   │   ├── authHandler.js         # JWT token verification
│   │   ├── allowRoles.js          # Role-based route guard
│   │   └── errorHandler.js        # Centralized HTTP & Mongoose error parser
│   ├── models/
│   │   ├── User.js                # Name, email, hashed password, role
│   │   ├── Product.js             # SKU, pricing, current stock, reorder level
│   │   ├── Supplier.js            # Name, phone, city
│   │   └── StockMovement.js       # Transaction logs (IN/OUT, quantities, profit)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── supplierRoutes.js
│   │   ├── stockRoutes.js
│   │   └── dashboardRoutes.js
│   ├── seed/
│   │   └── seed.js                # Pre-populates 12 items, 4 vendors & demo users
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.js         # Authentication API calls
│   │   │   ├── productApi.js      # Product CRUD API calls
│   │   │   ├── supplierApi.js     # Supplier API calls
│   │   │   ├── stockApi.js        # Stock In, Out, and Low-stock calls
│   │   │   └── dashboardApi.js    # Executive dashboard stats call
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Sticky header with role badge & navigation
│   │   │   ├── ProtectedRoute.jsx # Client route guards for authentication and roles
│   │   │   ├── ProductForm.jsx    # Reusable form component for Add and Edit
│   │   │   └── Loading.jsx        # Loading spinner
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login screen
│   │   │   ├── Register.jsx       # Staff registration screen
│   │   │   ├── Products.jsx       # Catalog listing with search & actions
│   │   │   ├── ProductDetails.jsx # Detailed specs & full movement audit history
│   │   │   ├── StockIn.jsx        # Purchase/restock screen with supplier selection
│   │   │   ├── StockOut.jsx       # Retail sale screen with instant profit estimate
│   │   │   ├── LowStock.jsx       # Critical reorder alerts table
│   │   │   ├── ProductAdd.jsx     # Admin item creation
│   │   │   ├── ProductEdit.jsx    # Admin item edit
│   │   │   ├── Suppliers.jsx      # Admin vendor management
│   │   │   ├── Dashboard.jsx      # Admin executive analytics & metrics
│   │   │   └── NotFound.jsx       # 404 handler
│   │   ├── App.jsx                # Router setup and user session state
│   │   ├── main.jsx               # React DOM root
│   │   └── index.css              # Custom styling
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── vercel.json                # Single-Page-App rewrite rules for Vercel
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 4. Prerequisites

Before running the application locally, ensure you have:
- **Node.js**: Version 18.x or newer (Tested on Node v26.x)
- **npm**: Version 9.x or newer
- **MongoDB Atlas Account**: A free MongoDB Atlas cluster connection URI.

---

## 5. Environment Variables Setup

### Backend Environment Configuration
1. Open the `backend/` folder.
2. Create a file named `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Fill in the values:
   ```env
   PORT=5001
   MONGO_URI=your_actual_mongodb_atlas_connection_string
   JWT_SECRET=super_secret_jwt_key_change_in_production_12345
   CLIENT_URL=http://localhost:5173
   ```
   > **Note on MONGO_URI:** Replace `your_actual_mongodb_atlas_connection_string` with your actual MongoDB connection string from Atlas (e.g. `mongodb+srv://admin:<password>@cluster0.mongodb.net/shop_inventory?retryWrites=true&w=majority`).

### Frontend Environment Configuration
1. Open the `frontend/` folder.
2. Create a file named `.env`:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
3. Fill in the API base URL:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

---

## 6. How to Seed the Database

Once your `backend/.env` contains your valid `MONGO_URI`, seed demo accounts, 12 realistic grocery and supermarket products, 4 vendors, and sample transaction movements by running:

```bash
cd backend
npm run seed
```

---

## 7. Demo Login Credentials

The seed script creates the following working accounts:

| Role | Email | Password | Allowed Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@shop.com` | `admin123` | Full access: Dashboard, Products, Add/Edit/Delete, Suppliers, Stock In/Out |
| **Staff** | `staff@shop.com` | `staff123` | Operational access: Products view, Stock In, Stock Out, Low Stock alerts |

---

## 8. How to Run Locally

### Start Backend API Server
In your first terminal tab:
```bash
cd backend
npm start
```
*The server will start on `http://localhost:5001`.*

### Start Frontend Application
In a second terminal tab:
```bash
cd frontend
npm run dev
```
*Open your browser and navigate to `http://localhost:5173`.*

---

## 9. API Endpoint Specification

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new staff user | Public |
| **POST** | `/api/auth/login` | Login user & return JWT token | Public |
| **GET** | `/api/auth/profile` | Get current logged in user | Private (All) |
| **POST** | `/api/auth/admin/create-admin` | Create new admin account | Private (Admin only) |
| **GET** | `/api/products` | Get products (optional `?search=`) | Private (All) |
| **GET** | `/api/products/:id` | Get single product by ID | Private (All) |
| **POST** | `/api/products` | Create new product | Private (Admin only) |
| **PUT** | `/api/products/:id` | Update product info | Private (Admin only) |
| **DELETE** | `/api/products/:id` | Delete product (checks stock & history) | Private (Admin only) |
| **GET** | `/api/products/:id/movements` | Get complete stock history of a product | Private (All) |
| **GET** | `/api/suppliers` | List all suppliers | Private (All) |
| **GET** | `/api/suppliers/:id` | Get supplier details | Private (All) |
| **POST** | `/api/suppliers` | Create supplier | Private (Admin only) |
| **PUT** | `/api/suppliers/:id` | Update supplier | Private (Admin only) |
| **DELETE** | `/api/suppliers/:id` | Delete supplier (checks references) | Private (Admin only) |
| **POST** | `/api/stock/in` | Restock/Purchase (increases stock) | Private (All) |
| **POST** | `/api/stock/out` | Record sale (decreases stock, prevents negative stock) | Private (All) |
| **GET** | `/api/stock/low-stock` | Get items where stock <= reorderLevel | Private (All) |
| **GET** | `/api/dashboard` | Aggregated valuation, sales, profit & alerts | Private (Admin only) |

---

## 10. Core Business Logic Highlights

1. **Atomic Stock-Out Prevention:**
   The `stockOut` controller executes a conditional MongoDB query:
   ```javascript
   Product.findOneAndUpdate(
     { _id: productId, currentStock: { $gte: qty } },
     { $inc: { currentStock: -qty } },
     { new: true }
   );
   ```
   This guarantees that two simultaneous sales can never cause negative stock.
2. **Audit Trails & Deletion Safeguards:**
   A product or supplier cannot be deleted if there are existing audit records in `StockMovement` or if positive inventory remains in the shop.
3. **Real-time Profit Calculation:**
   Each sale stores:
   $$\text{Profit} = (\text{Selling Price} - \text{Cost Price}) \times \text{Quantity}$$
   allowing the dashboard to compute exact gross profits for today's sales.

---

## 11. Deployment Guidelines

### Frontend on Vercel
1. Push repository to GitHub.
2. Import the `frontend` folder as the root directory on Vercel.
3. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-api.onrender.com/api`
4. Deploy. The included `frontend/vercel.json` rewrite rule ensures client-side routing on page refreshes works without 404 errors.

### Backend on Render / Railway
1. Create a Web Service pointing to the `backend` folder.
2. Set Environment Variables:
   - `PORT` = `5001`
   - `MONGO_URI` = Your MongoDB Atlas connection URI
   - `JWT_SECRET` = A strong random secret key
   - `CLIENT_URL` = Your deployed frontend Vercel URL
3. Build command: `npm install`
4. Start command: `npm start`

---

## 12. Deployment Status

- **Frontend Live URL:** [https://frontend-pi-three-18.vercel.app](https://frontend-pi-three-18.vercel.app)
- **Backend API Live URL:** [https://backend-eight-peach-74.vercel.app/api](https://backend-eight-peach-74.vercel.app/api)
- **Database:** MongoDB Atlas (`complete-backend.oxbhaat.mongodb.net`) — Live & Seeded
- **Hosting Platform:** Vercel (Production)
