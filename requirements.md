# back-end design

Completed: No
Parent item: zoom it (https://www.notion.so/zoom-it-262089ec8813806eadbfcf1bae40cec1?pvs=21)

## Sub tasks

[Untitled](Untitled%20262089ec88138012aeacdf2cf04ea32c.csv)

# **E-Commerce MERN Backend – Admin-only Product Upload**

---

## **1️⃣ Summary (Updated)**

**Purpose:**

Backend for E-commerce platform where **only admin can upload products**, users can browse, order, and write reviews (if purchased).

**Key Points:**

- Single-vendor (admin) only
- JWT authentication & role-based access
- CRUD for products & categories by admin
- Orders & tracking by user/admin
- Reviews allowed after purchase
- Admin moderation & user management

**Models:**

1. User
2. Category
3. Product
4. Review (embedded in Product)
5. Order (with tracking)

**Routes Overview:**

| Access | Actions |
| --- | --- |
| Public | register, login, list products, product details, add review,  track order |
| User (private) | create order, my orders, update profile |
| Admin | CRUD products & categories, list users & orders, delete user, delete review, update order status |
| Superadmin | create/delete admins, delete any user |

---

## **2️⃣ Step-by-Step Backend Requirements**

### **2.1 User Management**

- **Schema:** name, email, password, photo, role, createdAt
- **Routes:**
    - POST `/api/auth/register` → public
    - POST `/api/auth/login` → public
    - PUT `/api/users/profile` → private (user)
    - GET `/api/users` → admin
    - DELETE `/api/users/:id` → admin/superadmin

---

### **2.2 Category Management**

- **Schema:** name, slug, createdAt
- **Routes (admin only):**
    - POST `/api/categories` → get all categories (public)
    - POST `/api/categories` → create
    - PUT `/api/categories/:id` → update
    - DELETE `/api/categories/:id` → delete

---

### **2.3 Product Management (Admin-only)**

- **Schema:** name, slug, photos[], description, price, discount, stock, inStock, status, categories[], reviews[]
- **Routes (admin only):**
    - POST `/api/products` → create
    - PUT `/api/products/:id` → update
    - DELETE `/api/products/:id` → delete
- **Routes (public for viewing):**
    - GET `/api/products` → list all
    - GET `/api/products/:id` → single product details

---

### **2.4 Review Management**

- **Schema (embedded in Product):** user, name, rating, comment, createdAt
- **Rules:**
    - User can review only if purchased
    - Admin can delete review
- **Routes:**
    - POST `/api/products/review/id` → get all product by product id
    - POST `/api/products/review/:id/`→ user (if perched)
    - DELETE `/api/products/review/:id/:reviewId` → admin

---

### **2.5 Order Management**

- **Schema:** user, items[{product, name, price, qty}], shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice, status, updatedAt, createdAt
- **Routes:**
    - POST `/api/orders` → user (create order)
    - GET `/api/orders/myorders` → user (list own orders)
    - GET `/api/orders` → admin (list all orders, filter by date)

---

### **2.6 Track Order / Status Update**

- **Order Status Enum:** `['pending','processing','shipped','out-for-delivery','delivered','cancelled']`
- **Routes:**
    - GET `/api/orders/status`/`:id` → user
    - PUT `/api/orders/status`/`:id` → admin
- **Logic:**
    - Users can only view their own orders
    - Admin can update any order
    - Update `updatedAt` timestamp on status change

---

### **2.7 Authentication & Authorization**

- JWT (1-hour expiry)
- Middleware: `authMiddleware` & `adminMiddleware`

---

### **2.8 Other Requirements**

- Timestamps: createdAt & updatedAt for all models
- Pagination: products, users, orders
- Relations:
    - product.categories → Category
    - order.user → User
    - review.user → User
- 100% error handling

---

## **3️⃣ Models (Full Updated Mongoose Schema)**

### **3.1 User**

```jsx
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  photo: { type: String },
  role: { type: String, enum: ['user','admin','superadmin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

```

---

### **3.2 Category**

```jsx
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);

```

---

### **3.3 Review (Embedded)**

```jsx
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

```

---

### **3.4 Product**

```jsx
const mongoose = require('mongoose');
const reviewSchema = require('./review.model');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  photos: [{ type: String }],
  description: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  status: { type: String, enum: ['active','inactive'], default: 'active' },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  reviews: [reviewSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);

```

---

### **3.5 Order**

```jsx
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    { product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true }
    }
  ],
  shippingAddress: { address: String, city: String, postalCode: String, country: String },
  paymentMethod: { type: String },
  itemsPrice: { type: Number },
  shippingPrice: { type: Number },
  totalPrice: { type: Number },
  status: { type: String, enum: ['pending','processing','shipped','out-for-delivery','delivered','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);

```

---

### **4️⃣ Routes & Access Type**

**Public Routes**

```
POST /api/auth/register
POST /api/auth/login
GET /api/products
GET /api/products/:id
POST /api/products/:id/review (only if purchased)

```

**Private (User)**

```
POST /api/orders
GET /api/orders/myorders
PUT /api/users/profile
GET /api/orders/:id/status

```

**Admin Routes**

```
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
GET /api/orders
PUT /api/orders/:id/status
GET /api/users
DELETE /api/users/:id
DELETE /api/products/:id/review

```

**Super Admin Routes**

```
Create/delete admins or users

```

---

###