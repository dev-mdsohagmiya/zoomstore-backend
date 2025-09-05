# E-Commerce MERN Backend - Admin-only Product Upload

A comprehensive e-commerce backend built with Node.js, Express, and MongoDB where only admins can upload products, users can browse, order, and write reviews (if purchased).

## 📑 Table of Contents

- [🚀 Features](#-features)
- [📋 Prerequisites](#-prerequisites)
- [🛠️ Installation](#️-installation)
- [📚 API Documentation](#-api-documentation)
  - [Authentication Endpoints](#authentication-endpoints)
    - [Register User](#register-user)
    - [Login User](#login-user)
    - [Logout User](#logout-user)
  - [User Management Endpoints](#user-management-endpoints)
    - [Update Profile](#update-profile)
    - [Get All Users (Admin)](#get-all-users-admin)
    - [Create User (Admin)](#create-user-admin)
    - [Update User (Admin)](#update-user-admin)
    - [Delete User (Admin)](#delete-user-admin)
    - [Create Admin (Super Admin)](#create-admin-super-admin)
    - [Setup Super Admin](#setup-super-admin)
  - [Category Endpoints](#category-endpoints)
    - [Get All Categories](#get-all-categories)
    - [Create Category (Admin)](#create-category-admin)
    - [Update Category (Admin)](#update-category-admin)
    - [Delete Category (Admin)](#delete-category-admin)
  - [Product Endpoints](#product-endpoints)
    - [Get All Products](#get-all-products)
    - [Get Product by ID](#get-product-by-id)
    - [Create Product (Admin)](#create-product-admin)
    - [Update Product (Admin)](#update-product-admin)
    - [Delete Product (Admin)](#delete-product-admin)
    - [Add Product Review](#add-product-review)
    - [Delete Product Review (Admin)](#delete-product-review-admin)
  - [Order Endpoints](#order-endpoints)
    - [Create Order](#create-order)
    - [Get My Orders](#get-my-orders)
    - [Get All Orders (Admin)](#get-all-orders-admin)
    - [Get Order by ID](#get-order-by-id)
    - [Get Order Status](#get-order-status)
    - [Update Order Status (Admin)](#update-order-status-admin)
- [🧪 Testing the API](#-testing-the-api)
  - [Using Postman/Insomnia](#using-postmaninsomnia)
  - [Using cURL](#using-curl)
  - [Using JavaScript/Fetch](#using-javascriptfetch)
- [📸 Photo Upload Features](#-photo-upload-features)
- [🔍 Search & Filtering Features](#-search--filtering-features)
- [🔐 Role-Based Access Control](#-role-based-access-control)
- [📁 Project Structure](#-project-structure)
- [🚨 Error Handling](#-error-handling)
- [📊 Response Format](#-response-format)
- [🔧 Environment Variables](#-environment-variables)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [🆘 Support](#-support)

## 🚀 Features

- **Role-based Authentication**: User, Admin, and Super Admin roles
- **JWT Authentication**: Secure token-based authentication
- **Product Management**: Admin-only product CRUD operations with photo uploads, sizes, and colors
- **Category Management**: Admin-only category management with automatic product relationships
- **Order Management**: Complete order lifecycle with status tracking and photo uploads
- **Review System**: Purchase-verified product reviews
- **File Upload**: Cloudinary integration for image uploads (products, categories, orders, users)
- **Category-Product Relationships**: Automatic bidirectional relationship management
- **Pagination**: Built-in pagination for all list endpoints
- **Search & Filtering**: Advanced product search and filtering, user role filtering
- **Photo Upload Support**: Multiple photo uploads for products and orders
- **User Management**: Complete user CRUD operations with role-based permissions
- **Role-Based Access Control**: Granular permissions for user, admin, and super admin roles

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image uploads)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/ecommerce

   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d

   # Super Admin Credentials
   SUPER_ADMIN_EMAIL=admin@example.com
   SUPER_ADMIN_PASSWORD=your_super_admin_password

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # CORS
   CORS_ORIGIN=http://localhost:3000

   # Server
   PORT=8000
   ```

4. **Setup Super Admin** (Optional)

   You can create the super admin user in two ways:

   **Option A: Using the setup script**

   ```bash
   node create-super-admin.js
   ```

   **Option B: Using the API endpoint**

   ```bash
   curl -X POST http://localhost:8000/api/v1/super-admin/setup
   ```

   **Option C: Test login functionality**

   ```bash
   node test/test-login.js
   ```

   **Option D: Test super admin validation**

   ```bash
   node test/test-super-admin-validation.js
   ```

   **Option E: Test direct model validation**

   ```bash
   node test/test-validation-direct.js
   ```

   **Option F: Run all tests**

   ```bash
   node test/run-all-tests.js
   ```

5. **Start the server**

   ```bash
   npm run dev
   ```

   **Alternative: Start server for testing**

   ```bash
   node test/start-server.js
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: multipart/form-data

Body:
- name: string (required)
- email: string (required)
- password: string (required)
- photo: file (optional)
- role: string (optional, default: 'user')
- address: object (optional)
  - street: string (optional)
  - city: string (optional)
  - state: string (optional)
  - zipCode: string (optional)
  - country: string (optional, default: 'Bangladesh')

Response: Returns user data with access token (auto-login)
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response: Returns user data with access token and role information

- For regular users: "User logged in successfully"
- For admins: "Admin logged in successfully"
- For super admins: "Super Admin logged in successfully"

#### Logout User

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

### User Management Endpoints

#### Update Profile

```http
PUT /users/profile
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Body:
- name: string (optional)
- email: string (optional)
- photo: file (optional)
- address: object (optional)
  - street: string (optional)
  - city: string (optional)
  - state: string (optional)
  - zipCode: string (optional)
  - country: string (optional)
```

#### Get All Users (Admin)

```http
GET /users?page=1&limit=10&role=user&search=john
Authorization: Bearer <admin_access_token>
```

Query Parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `role`: Filter by role (`user`, `admin`, `superadmin`)
- `search`: Search in name and email (case-insensitive)

Response:

```json
{
  "statusCode": 200,
  "data": {
    "users": [
      {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "photo": "https://example.com/photo.jpg",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10001",
          "country": "USA"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    },
    "filters": {
      "role": "user",
      "search": "john"
    }
  },
  "message": "Users retrieved successfully",
  "success": true
}
```

#### Create User (Admin)

````http
POST /users
Authorization: Bearer <admin_access_token>
Content-Type: multipart/form-data

Body:
- name: string (required)
- email: string (required)
- password: string (required)
- role: string (optional, default: 'user')
- photo: file (optional)
- address: object (optional)
  - street: string (optional)
  - city: string (optional)
  - state: string (optional)
  - zipCode: string (optional)
  - country: string (optional)

Response:
```json
{
  "statusCode": 201,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "photo": "https://res.cloudinary.com/example/image/upload/v1234567890/profile.jpg",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully as user",
  "success": true
}
````

**Role Permissions:**

- **Admin**: Can only create regular users (role: "user")
- **Super Admin**: Can create users and admins (role: "user" or "admin")

#### Update User (Admin)

````http
PUT /users/:id
Authorization: Bearer <admin_access_token>
Content-Type: multipart/form-data

Body:
- name: string (optional)
- email: string (optional)
- role: string (optional)
- photo: file (optional)
- address: object (optional)
  - street: string (optional)
  - city: string (optional)
  - state: string (optional)
  - zipCode: string (optional)
  - country: string (optional)

Response:
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "user",
    "photo": "https://res.cloudinary.com/example/image/upload/v1234567890/new_profile.jpg",
    "address": {
      "street": "456 Oak St",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90210",
      "country": "USA"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User updated successfully",
  "success": true
}
````

**Role Permissions:**

- **Admin**: Can only update regular users, cannot change roles to admin/super admin
- **Super Admin**: Can update users and admins, cannot change roles to super admin

#### Delete User (Admin)

```http
DELETE /users/:id
Authorization: Bearer <admin_access_token>
```

Response:

```json
{
  "statusCode": 200,
  "data": null,
  "message": "User deleted successfully",
  "success": true
}
```

**Role Permissions:**

- **Admin**: Can only delete regular users
- **Super Admin**: Can delete users and admins
- **Security**: Cannot delete own account, cannot delete other super admins

#### Create Admin (Super Admin)

```http
POST /admin/create
Authorization: Bearer <superadmin_access_token>
Content-Type: multipart/form-data

Body:
- name: string (required)
- email: string (required)
- password: string (required)
- photo: file (optional)
- address: object (optional)
  - street: string (optional)
  - city: string (optional)
  - state: string (optional)
  - zipCode: string (optional)
  - country: string (optional)

Response: Returns admin data with access token (auto-login)
```

#### Setup Super Admin

```http
POST /super-admin/setup
```

Creates super admin user from environment variables `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`.

**Security Note**: Super admin role can ONLY be created through environment variables. Attempting to create super admin through registration or admin creation endpoints will result in a 403 Forbidden error.

Response: Returns super admin data

````

### Category Endpoints

#### Get All Categories

```http
GET /categories
```

Response: Returns categories with populated products
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "category_id",
      "name": "Electronics",
      "slug": "electronics",
      "image": "https://example.com/electronics.jpg",
      "products": [
        {
          "_id": "product_id",
          "name": "Gaming Laptop",
          "slug": "gaming-laptop",
          "price": 1200,
          "photos": ["https://example.com/laptop.jpg"],
          "rating": 4.5,
          "numReviews": 10
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Categories retrieved successfully",
  "success": true
}
```

#### Create Category (Admin)

```http
POST /categories
Authorization: Bearer <admin_access_token>
Content-Type: multipart/form-data

Body:
- name: string (required)
- image: file (optional)

Example:
{
  "name": "Electronics"
}
```

#### Update Category (Admin)

```http
PUT /categories/:id
Authorization: Bearer <admin_access_token>
Content-Type: multipart/form-data

Body:
- name: string (required)
- image: file (optional)

Example:
{
  "name": "Updated Category Name"
}
```

#### Delete Category (Admin)

```http
DELETE /categories/:id
Authorization: Bearer <admin_access_token>
```

### Product Endpoints

#### Get All Products

```http
GET /products?page=1&limit=10&category=electronics&search=laptop&minPrice=100&maxPrice=1000&sort=price-low
```

Query Parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Category slug filter
- `search`: Search in name and description
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `sort`: Sort by (price-low, price-high, rating, newest)

#### Get Product by ID

```http
GET /products/:id
```

#### Create Product (Admin)

```http
POST /products
Authorization: Bearer <admin_access_token>
Content-Type: multipart/form-data

Body:
- name: string (required)
- description: string (required)
- price: number (required)
- discount: number (optional, default: 0)
- stock: number (optional, default: 0)
- categories: array of category IDs (optional)
- photos: files (optional, max 5)
- sizes: array of strings or comma-separated string (optional)
- colors: array of strings or comma-separated string (optional)

Response:
```json
{
  "statusCode": 200,
  "data": {
    "_id": "product_id",
    "name": "Gaming Laptop",
    "slug": "gaming-laptop",
    "description": "High-performance gaming laptop",
    "price": 1200,
    "discount": 10,
    "stock": 50,
    "inStock": true,
    "status": "active",
    "photos": [
      "https://res.cloudinary.com/example/image/upload/v1234567890/laptop1.jpg",
      "https://res.cloudinary.com/example/image/upload/v1234567890/laptop2.jpg"
    ],
    "sizes": ["13 inch", "15 inch", "17 inch"],
    "colors": ["Black", "Silver", "Space Gray"],
    "categories": [
      {
        "_id": "category_id",
        "name": "Electronics",
        "slug": "electronics"
      }
    ],
    "numReviews": 0,
    "rating": 0,
    "reviews": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Product created successfully",
  "success": true
}
```

#### Update Product (Admin)

```http
PUT /products/:id
Authorization: Bearer <admin_access_token>
Content-Type: multipart/form-data

Body: (same as create, all fields optional)
- sizes: array of strings or comma-separated string (optional)
- colors: array of strings or comma-separated string (optional)
```

#### Delete Product (Admin)

```http
DELETE /products/:id
Authorization: Bearer <admin_access_token>
```

#### Add Product Review

```http
POST /products/:id/review
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "rating": 5,
  "comment": "Great product!"
}
```

#### Delete Product Review (Admin)

```http
DELETE /products/:id/review/:reviewId
Authorization: Bearer <admin_access_token>
```

### Order Endpoints

#### Create Order

```http
POST /orders
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Body:
- items: JSON string (required)
- shippingAddress: JSON string (required)
- paymentMethod: string (required)
- photos: files (optional, max 5)

Example:
```json
{
  "items": [
    {
      "product": "product_id",
      "qty": 2
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
```

Response:
```json
{
  "statusCode": 200,
  "data": {
    "_id": "order_id",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "product": "product_id",
        "name": "Gaming Laptop",
        "price": 1200,
        "qty": 2
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "credit_card",
    "itemsPrice": 2400,
    "shippingPrice": 0,
    "totalPrice": 2400,
    "status": "pending",
    "isPaid": false,
    "isDelivered": false,
    "photos": [
      {
        "url": "https://res.cloudinary.com/example/image/upload/v1234567890/order1.jpg",
        "publicId": "order1_abc123"
      },
      {
        "url": "https://res.cloudinary.com/example/image/upload/v1234567890/order2.jpg",
        "publicId": "order2_def456"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Order created successfully",
  "success": true
}
```

#### Get My Orders

```http
GET /orders/myorders?page=1&limit=10
Authorization: Bearer <access_token>
```

#### Get All Orders (Admin)

```http
GET /orders?page=1&limit=10&status=pending&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin_access_token>
```

#### Get Order by ID

```http
GET /orders/:id
Authorization: Bearer <access_token>
```

#### Get Order Status

```http
GET /orders/status/:id
Authorization: Bearer <access_token>
```

#### Update Order Status (Admin)

```http
PUT /orders/status/:id
Authorization: Bearer <admin_access_token>
Content-Type: application/json

Body:
{
  "status": "shipped"
}
```

Valid statuses: `pending`, `processing`, `shipped`, `out-for-delivery`, `delivered`, `cancelled`

## 🧪 Testing the API

### Using Postman/Insomnia

1. **Import the collection**: Use the provided Postman collection or create requests manually
2. **Set up environment variables**:
   - `base_url`: `http://localhost:8000/api/v1`
   - `access_token`: (will be set after login)

### Using cURL

#### Register a new user:

```bash
curl -X POST http://localhost:8000/api/v1/users/auth/register \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=password123"
```

#### Login:

```bash
curl -X POST http://localhost:8000/api/v1/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

#### Get all products:

```bash
curl -X GET http://localhost:8000/api/v1/products
```

#### Create a product with photos, sizes, and colors (Admin):

```bash
# JSON array format
curl -X POST http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "name=Gaming Laptop" \
  -F "description=High-performance gaming laptop" \
  -F "price=1200" \
  -F "discount=10" \
  -F "stock=50" \
  -F "categories=[\"category_id\"]" \
  -F "photos=@/path/to/image1.jpg" \
  -F "photos=@/path/to/image2.jpg" \
  -F "sizes=[\"13 inch\", \"15 inch\", \"17 inch\"]" \
  -F "colors=[\"Black\", \"Silver\", \"Space Gray\"]"

# Comma-separated format
curl -X POST http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "name=Gaming Mouse" \
  -F "description=High-precision gaming mouse" \
  -F "price=99.99" \
  -F "discount=5" \
  -F "stock=100" \
  -F "categories=[\"category_id\"]" \
  -F "photos=@/path/to/mouse.jpg" \
  -F "sizes=Small, Medium, Large" \
  -F "colors=Black, White, Red, Blue"
```

#### Create an order with photos:

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "items=[{\"product\":\"product_id\",\"qty\":2}]" \
  -F "shippingAddress={\"address\":\"123 Main St\",\"city\":\"New York\",\"postalCode\":\"10001\",\"country\":\"USA\"}" \
  -F "paymentMethod=credit_card" \
  -F "photos=@/path/to/order_photo.jpg"
```

#### Get users with role filtering (Admin):

```bash
# Get all users
curl -X GET "http://localhost:8000/api/v1/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get only users with 'user' role
curl -X GET "http://localhost:8000/api/v1/users?page=1&limit=10&role=user" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Search users by name or email
curl -X GET "http://localhost:8000/api/v1/users?page=1&limit=10&search=john" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Combined filters
curl -X GET "http://localhost:8000/api/v1/users?page=1&limit=10&role=user&search=john" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Create a user (Admin):

```bash
curl -X POST http://localhost:8000/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=password123" \
  -F "role=user" \
  -F "photo=@/path/to/profile.jpg"
```

#### Update a user (Admin):

```bash
curl -X PUT http://localhost:8000/api/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "name=Updated Name" \
  -F "email=updated@example.com" \
  -F "role=user" \
  -F "photo=@/path/to/new_profile.jpg"
```

#### Delete a user (Admin):

```bash
curl -X DELETE http://localhost:8000/api/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Create a category (Admin):

```bash
curl -X POST http://localhost:8000/api/v1/categories \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "name=Electronics" \
  -F "image=@/path/to/category_image.jpg"
```

### Using JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch("http://localhost:8000/api/v1/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "john@example.com",
    password: "password123",
  }),
});

const loginData = await loginResponse.json();
const accessToken = loginData.data.accessToken;

// Get products
const productsResponse = await fetch("http://localhost:8000/api/v1/products", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const productsData = await productsResponse.json();
console.log(productsData);
```

## 🔐 Role-Based Access Control

### User Roles:

- **user**: Can browse products, create orders, write reviews (if purchased)
- **admin**: Can manage products, categories, orders, and users (limited permissions)
- **superadmin**: Can create/delete admins and manage all resources

### Access Levels:

- **Public**: Register, login, view products, view categories
- **User**: Profile management, order creation, reviews
- **Admin**: Product CRUD, category CRUD, order management, user management (users only)
- **Super Admin**: Admin creation, full system access, complete user management

### User Management Permissions:

#### Admin Permissions:
- ✅ Create regular users (role: "user")
- ✅ Update regular users
- ✅ Delete regular users
- ✅ View all users with filtering
- ❌ Cannot create/update/delete other admins
- ❌ Cannot create/update/delete super admins
- ❌ Cannot change user roles to admin or super admin

#### Super Admin Permissions:
- ✅ Create users and admins
- ✅ Update users and admins
- ✅ Delete users and admins
- ✅ View all users with filtering
- ❌ Cannot create/update/delete other super admins
- ❌ Cannot change any user role to super admin
- ❌ Cannot delete their own account

## 📁 Project Structure

```
src/
├── controllers/          # Route controllers
│   ├── user.controller.js
│   ├── category.controller.js
│   ├── product.controller.js
│   └── order.controller.js
├── middlewares/          # Custom middlewares
│   ├── auth.middleware.js
│   ├── admin.middleware.js
│   └── multer.middleware.js
├── models/              # Database models
│   ├── user.model.js
│   ├── category.model.js
│   ├── product.model.js
│   ├── order.model.js
│   └── review.model.js
├── routes/              # API routes
│   ├── user.route.js
│   ├── category.route.js
│   ├── product.route.js
│   └── order.route.js
├── utils/               # Utility functions
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   └── cloudinary.js
├── app.js               # Express app configuration
└── index.js             # Server entry point
```

## 🚨 Error Handling

The API uses consistent JSON error responses with detailed information:

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Error message",
  "data": null,
  "errors": [],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/auth/register",
  "stack": "Error stack trace (development only)"
}
```

### Error Response Fields:

- `statusCode`: HTTP status code
- `success`: Always `false` for errors
- `message`: Human-readable error message
- `data`: Always `null` for errors
- `errors`: Array of detailed error objects (for validation errors)
- `timestamp`: ISO timestamp when error occurred
- `path`: API endpoint where error occurred
- `stack`: Error stack trace (only in development mode)

### Common Error Types:

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `422` - Unprocessable Entity (validation errors)
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

## 📊 Response Format

All successful responses follow this format:

```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message",
  "success": true
}
```

### Common Response Examples

#### Product with Photos
```json
{
  "statusCode": 200,
  "data": {
    "_id": "product_id",
    "name": "Gaming Laptop",
    "slug": "gaming-laptop",
    "description": "High-performance gaming laptop",
    "price": 1200,
    "discount": 10,
    "stock": 50,
    "inStock": true,
    "status": "active",
    "photos": [
      "https://res.cloudinary.com/example/image/upload/v1234567890/laptop1.jpg",
      "https://res.cloudinary.com/example/image/upload/v1234567890/laptop2.jpg"
    ],
    "categories": [
      {
        "_id": "category_id",
        "name": "Electronics",
        "slug": "electronics"
      }
    ],
    "numReviews": 5,
    "rating": 4.5,
    "reviews": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Product created successfully",
  "success": true
}
```

#### Order with Photos
```json
{
  "statusCode": 200,
  "data": {
    "_id": "order_id",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "product": "product_id",
        "name": "Gaming Laptop",
        "price": 1200,
        "qty": 2
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "credit_card",
    "itemsPrice": 2400,
    "shippingPrice": 0,
    "totalPrice": 2400,
    "status": "pending",
    "isPaid": false,
    "isDelivered": false,
    "photos": [
      {
        "url": "https://res.cloudinary.com/example/image/upload/v1234567890/order1.jpg",
        "publicId": "order1_abc123"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Order created successfully",
  "success": true
}
```

#### Users with Filtering
```json
{
  "statusCode": 200,
  "data": {
    "users": [
      {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "photo": "https://res.cloudinary.com/example/image/upload/v1234567890/user.jpg",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10001",
          "country": "USA"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    },
    "filters": {
      "role": "user",
      "search": "john"
    }
  },
  "message": "Users retrieved successfully",
  "success": true
}
```

## 🔗 Category-Product Relationship

The system automatically manages the relationship between categories and products:

- **Automatic Updates**: When products are created/updated/deleted, categories are automatically updated
- **Bidirectional Relationship**: Products reference categories, and categories include their products
- **Populated Responses**: Category endpoints return products within each category
- **Data Consistency**: Product deletion removes the product from all associated categories

## 🔍 Search & Filtering Features

### Product Filtering
- **Category Filter**: Filter products by category slug
- **Price Range**: Filter by minimum and maximum price
- **Search**: Search in product name and description
- **Sorting**: Sort by price (low/high), rating, or newest
- **Pagination**: Built-in pagination support

### User Filtering (Admin Only)
- **Role Filter**: Filter users by role (user, admin, superadmin)
- **Search**: Search users by name or email
- **Combined Filters**: Use multiple filters together
- **Pagination**: Built-in pagination support

### Order Filtering (Admin Only)
- **Status Filter**: Filter orders by status
- **Date Range**: Filter by start and end dates
- **Pagination**: Built-in pagination support

### Example Filtering Queries
```bash
# Product filtering
GET /products?category=electronics&search=laptop&minPrice=100&maxPrice=1000&sort=price-low

# User filtering (Admin)
GET /users?role=user&search=john&page=1&limit=10

# Order filtering (Admin)
GET /orders?status=pending&startDate=2024-01-01&endDate=2024-12-31
```

### Quick Test Commands

```bash
# Run all tests
node test/run-all-tests.js

# Test super admin validation
node test/test-super-admin-validation.js

# Test login functionality
node test/test-login.js

# Test direct model validation
node test/test-validation-direct.js

# Test product photo upload functionality
node test/test-product-photo-upload.js

# Test order photo upload functionality
node test/test-order-photo-upload.js

# Test user role filtering functionality
node test/test-user-role-filtering.js

# Test user management functionality
node test/test-user-management.js

# Test product size and color functionality
node test/test-product-size-color.js
```

### Testing New Features

#### Product Photo Upload Testing
```bash
# Test product creation with single photo
node test/test-product-photo-upload.js

# Test product creation with multiple photos
# The test script automatically tests both single and multiple photo uploads
```

#### Order Photo Upload Testing
```bash
# Test order creation with photo uploads
node test/test-order-photo-upload.js

# Test order creation with multiple photos
# The test script handles both single and multiple photo scenarios
```

#### User Role Filtering Testing
```bash
# Test user filtering by role and search
node test/test-user-role-filtering.js

# Test cases include:
# - Filter by role (user, admin, superadmin)
# - Search by name or email
# - Combined filters
# - Invalid role handling
```

#### User Management Testing
```bash
# Test user management functionality
node test/test-user-management.js

# Test cases include:
# - Admin creating users
# - Admin updating users
# - Admin deleting users
# - Permission restrictions (admin cannot manage other admins)
# - Super admin creating admins
# - Role validation and security checks
# - Self-deletion prevention
```

#### Product Size and Color Testing
```bash
# Test product size and color functionality
node test/test-product-size-color.js

# Test cases include:
# - Product creation with JSON array format for sizes/colors
# - Product creation with comma-separated format for sizes/colors
# - Product update with new sizes and colors
# - Product retrieval to verify data persistence
# - Flexible input parsing validation
# - Both create and update operations
```

See `test/README.md` for detailed testing information.

## 📦 Product Size and Color Features

### Size and Color Management
- **Multiple Sizes**: Products can have multiple size options
- **Multiple Colors**: Products can have multiple color variants
- **Flexible Input**: Supports both JSON arrays and comma-separated strings
- **Data Validation**: Automatic trimming and filtering of empty values
- **Backward Compatibility**: Existing products without sizes/colors have empty arrays

### Input Format Support
- **JSON Array Format**: `["Small", "Medium", "Large"]`
- **Comma-Separated Format**: `"Small, Medium, Large"`
- **Automatic Parsing**: Handles both formats seamlessly
- **Error Handling**: Graceful fallback for invalid input

### API Integration
- **Create Product**: Include sizes and colors in product creation
- **Update Product**: Modify sizes and colors in product updates
- **Retrieve Product**: Sizes and colors included in product responses
- **Search & Filter**: Can be used for advanced product filtering

## 📸 Photo Upload Features

### Supported Upload Types
- **Product Photos**: Multiple photos per product (max 5)
- **Order Photos**: Multiple photos per order (max 5)
- **Category Images**: Single image per category
- **User Profile Photos**: Single photo per user

### Cloudinary Integration
- **Automatic Upload**: Files are automatically uploaded to Cloudinary
- **URL Generation**: Cloudinary URLs are returned in API responses
- **Public ID Storage**: Public IDs are stored for future management
- **File Cleanup**: Temporary files are automatically deleted after upload

### Upload Endpoints
```bash
# Product photos
POST /products (multipart/form-data)
- photos: files (max 5)

# Order photos
POST /orders (multipart/form-data)
- photos: files (max 5)

# Category images
POST /categories (multipart/form-data)
- image: file (max 1)

# User profile photos
POST /users/auth/register (multipart/form-data)
PUT /users/profile (multipart/form-data)
- photo: file (max 1)
```

## 🔒 Security Features

- **Super Admin Protection**: Super admin role can only be created from environment variables
- **Role-based Access Control**: Different permission levels for users, admins, and super admins
- **JWT Authentication**: Secure token-based authentication with 1-day expiry
- **Input Validation**: Comprehensive validation for all endpoints
- **Password Hashing**: Secure bcrypt password hashing
- **File Upload Security**: Multer middleware with file type validation
- **Cloudinary Security**: Secure API key management for image uploads

## 🔧 Environment Variables

Make sure to set up all required environment variables in your `.env` file:

- `MONGODB_URI`: MongoDB connection string
- `ACCESS_TOKEN_SECRET`: JWT access token secret
- `ACCESS_TOKEN_EXPIRY`: Access token expiry time
- `SUPER_ADMIN_EMAIL`: Super admin email address
- `SUPER_ADMIN_PASSWORD`: Super admin password
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `CORS_ORIGIN`: Frontend URL for CORS
- `PORT`: Server port

## 🚀 Deployment

1. **Prepare for production**:
   - Set `NODE_ENV=production`
   - Use a production MongoDB instance
   - Set secure JWT secrets
   - Configure CORS for your domain

2. **Deploy to your preferred platform**:
   - Heroku
   - AWS
   - DigitalOcean
   - Vercel
   - Railway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please create an issue in the repository or contact the development team.

---

## 🆕 Recent Updates

### New Features Added
- **Photo Upload Support**: Added photo upload functionality for products and orders
- **User Role Filtering**: Added role-based filtering and search for user management
- **User Management System**: Complete CRUD operations for user management with role-based permissions
- **Product Size and Color**: Added size and color properties to products with flexible input formats
- **Enhanced API Responses**: Updated all responses to include photo URLs and filtering information
- **Comprehensive Testing**: Added test scripts for all new features
- **Improved Documentation**: Updated README with detailed examples and usage instructions

### Photo Upload Capabilities
- ✅ Product photos (multiple, max 5)
- ✅ Order photos (multiple, max 5)
- ✅ Category images (single)
- ✅ User profile photos (single)
- ✅ Cloudinary integration with automatic URL generation
- ✅ Public ID storage for future management

### Filtering & Search Features
- ✅ Product filtering by category, price, search, and sorting
- ✅ User filtering by role and search (Admin only)
- ✅ Order filtering by status and date range (Admin only)
- ✅ Combined filter support
- ✅ Pagination for all filtered results

### User Management Capabilities
- ✅ Create users (Admin/Super Admin)
- ✅ Update users (Admin/Super Admin)
- ✅ Delete users (Admin/Super Admin)
- ✅ Role-based permission validation
- ✅ Photo upload support for user profiles
- ✅ Self-deletion prevention
- ✅ Super admin role protection

### Product Size and Color Capabilities
- ✅ Multiple sizes per product
- ✅ Multiple colors per product
- ✅ JSON array input format support
- ✅ Comma-separated string input format support
- ✅ Automatic data validation and trimming
- ✅ Backward compatibility with existing products
- ✅ Create and update operations support

### Testing Coverage
- ✅ Product photo upload testing
- ✅ Order photo upload testing
- ✅ User role filtering testing
- ✅ User management testing
- ✅ Product size and color testing
- ✅ Comprehensive cURL examples
- ✅ JavaScript/Fetch examples

**Happy Coding! 🎉**
````
