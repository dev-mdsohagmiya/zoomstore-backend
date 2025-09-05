# 🛒 ZoomIt E-Commerce Backend API

A robust, scalable e-commerce backend API built with Node.js, Express.js, and MongoDB. Features comprehensive product management, order processing, shopping cart functionality, and role-based access control with advanced admin capabilities.

## 🌟 Key Highlights

- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **📦 Complete Product Management**: Admin-controlled product CRUD with photo uploads, sizes, and colors
- **🛒 Advanced Shopping Cart**: Smart cart system with stock management and automatic expiration
- **📋 Order Management**: Full order lifecycle with status tracking and photo uploads
- **👥 User Management**: Comprehensive user administration with role-based permissions
- **📸 Photo Uploads**: Cloudinary integration for seamless image management
- **🔍 Advanced Search**: Powerful filtering and search capabilities across all entities
- **📊 Admin Dashboard**: Complete admin control over users, products, orders, and carts

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
  - [Cart Management Endpoints](#-cart-management-endpoints)
    - [Get User's Cart](#get-users-cart)
    - [Add Item to Cart](#add-item-to-cart)
    - [Update Cart Item Quantity](#update-cart-item-quantity)
    - [Remove Item from Cart](#remove-item-from-cart)
    - [Clear Entire Cart](#clear-entire-cart)
    - [Get Cart Summary](#get-cart-summary)
    - [Clean Expired Items (Admin Only)](#clean-expired-items-admin-only)
    - [Admin Cart Management Endpoints](#admin-cart-management-endpoints)
      - [Get All User Carts (Admin Only)](#get-all-user-carts-admin-only)
      - [Get Specific User's Cart (Admin Only)](#get-specific-users-cart-admin-only)
      - [Remove Item from User's Cart (Admin Only)](#remove-item-from-users-cart-admin-only)
      - [Clear User's Cart (Admin Only)](#clear-users-cart-admin-only)
      - [Update User's Cart Item Quantity (Admin Only)](#update-users-cart-item-quantity-admin-only)
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

### 🔐 Authentication & Authorization

- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Three-tier permission system (User, Admin, Super Admin)
- **Protected Routes**: Granular access control for different user roles
- **Session Management**: Secure login/logout with token validation

### 📦 Product Management

- **Admin-only Product CRUD**: Complete product lifecycle management
- **Photo Upload Support**: Multiple photo uploads (max 5) with Cloudinary integration
- **Size & Color Variants**: Flexible product variants with validation
- **Stock Management**: Real-time inventory tracking and updates
- **Category Integration**: Automatic product-category relationship management
- **Review System**: Purchase-verified product reviews and ratings

### 🛒 Shopping Cart System

- **Smart Cart Management**: User-specific cart with automatic stock management
- **Size & Color Selection**: Product variant selection with validation
- **Automatic Expiration**: Cart items expire after 1 day
- **Stock Integration**: Real-time stock updates when items are added/removed
- **Price Calculation**: Automatic price calculation with discounts
- **Admin Cart Control**: Admins can view and manage all user carts

### 📋 Order Management

- **Complete Order Lifecycle**: From creation to delivery tracking
- **Photo Upload Support**: Order photos for verification
- **Status Tracking**: Real-time order status updates
- **Admin Order Management**: Complete order administration capabilities
- **User Order History**: Personal order tracking and history

### 👥 User Management

- **User Registration & Login**: Secure user account creation
- **Profile Management**: User profile updates with photo uploads
- **Admin User Control**: Complete user administration (create, update, delete)
- **Role Management**: Dynamic role assignment and permission control
- **Search & Filtering**: Advanced user search and filtering capabilities

### 🔍 Advanced Features

- **Powerful Search**: Full-text search across products, users, and orders
- **Advanced Filtering**: Multi-criteria filtering with pagination
- **File Upload System**: Cloudinary integration for all image uploads
- **Pagination**: Built-in pagination for all list endpoints
- **Error Handling**: Comprehensive error handling with detailed messages
- **API Documentation**: Complete API documentation with examples

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Cloudinary Account** - [Sign up here](https://cloudinary.com/) (for image uploads)
- **Git** - [Download here](https://git-scm.com/)

### System Requirements

- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 1GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux Ubuntu 18.04+

## 🛠️ Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd zoomit-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/zoomit_ecommerce

# JWT Configuration
ACCESS_TOKEN_SECRET=your_super_secure_jwt_secret_here_minimum_32_characters
ACCESS_TOKEN_EXPIRY=7d

# Super Admin Credentials (for initial setup)
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=your_super_admin_password

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
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

### Step 6: Start the Application

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start

# Alternative: Start server for testing
node test/start-server.js
```

### Step 7: Verify Installation

- ✅ Server running on `http://localhost:8000`
- ✅ API documentation available
- ✅ Database connected successfully
- ✅ Super admin created (check console logs)

### 🚀 Quick Start Commands

```bash
# Development with auto-restart
npm run dev

# Run tests
npm test

# Clear database (development only)
node clear-database.js

# Fix database issues
node fix-database-complete.js
```

## 📚 API Documentation

### 🌐 Base URL

```
http://localhost:8000/api/v1
```

### 📊 API Overview

| Endpoint Category       | Count  | Description                                 |
| ----------------------- | ------ | ------------------------------------------- |
| **Authentication**      | 3      | User registration, login, logout            |
| **User Management**     | 6      | User CRUD operations with role-based access |
| **Category Management** | 4      | Category CRUD operations (Admin only)       |
| **Product Management**  | 6      | Product CRUD operations with photo uploads  |
| **Order Management**    | 6      | Complete order lifecycle management         |
| **Cart Management**     | 12     | Shopping cart with admin controls           |
| **Total Endpoints**     | **37** | Complete e-commerce API suite               |

### 🔐 Authentication Flow

1. **Register/Login** → Get JWT token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Role-based access** automatically enforced
4. **Token expiry** handled gracefully with refresh

### 📝 Response Format

All API responses follow a consistent format:

```json
{
  "statusCode": 200,
  "data": {
    /* response data */
  },
  "message": "Success message",
  "success": true
}
```

### 🚨 Error Handling

- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error (server issues)

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

### Cart Management Endpoints

#### Get User's Cart
```http
GET /cart
Authorization: Bearer <access_token>
```

Response:
```json
{
  "statusCode": 200,
  "data": {
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "photos": ["url1", "url2"],
          "price": 100,
          "discount": 10,
          "stock": 48,
          "sizes": ["S", "M", "L", "XL"],
          "colors": ["Red", "Blue", "Green", "Black"]
        },
        "quantity": 2,
        "price": 90,
        "selectedSize": "M",
        "selectedColor": "Red",
        "addedAt": "2024-01-01T00:00:00.000Z",
        "expiresAt": "2024-01-02T00:00:00.000Z"
      }
    ],
    "totalItems": 2,
    "totalPrice": 180,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "Cart retrieved successfully",
  "success": true
}
```

#### Add Item to Cart
```http
POST /cart/add
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
- productId: string (required)
- quantity: number (optional, default: 1, max: 10)
- selectedSize: string (optional, must be from product's available sizes)
- selectedColor: string (optional, must be from product's available colors)

Response:
```json
{
  "statusCode": 200,
  "data": {
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Gaming Laptop",
          "photos": ["url1", "url2"],
          "price": 1200,
          "discount": 10,
          "stock": 48,
          "sizes": ["13 inch", "15 inch", "17 inch"],
          "colors": ["Black", "Silver", "Space Gray"]
        },
        "quantity": 1,
        "price": 1080,
        "selectedSize": "15 inch",
        "selectedColor": "Black",
        "addedAt": "2024-01-01T00:00:00.000Z",
        "expiresAt": "2024-01-02T00:00:00.000Z"
      }
    ],
    "totalItems": 1,
    "totalPrice": 1080,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "Item added to cart successfully",
  "success": true
}
```

#### Update Cart Item Quantity
```http
PUT /cart/update
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
- productId: string (required)
- quantity: number (required, 0-10, 0 removes item)
- selectedSize: string (optional, must be from product's available sizes)
- selectedColor: string (optional, must be from product's available colors)

Response:
```json
{
  "statusCode": 200,
  "data": {
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Gaming Laptop",
          "photos": ["url1", "url2"],
          "price": 1200,
          "discount": 10,
          "stock": 47,
          "sizes": ["13 inch", "15 inch", "17 inch"],
          "colors": ["Black", "Silver", "Space Gray"]
        },
        "quantity": 2,
        "price": 1080,
        "selectedSize": "17 inch",
        "selectedColor": "Silver",
        "addedAt": "2024-01-01T00:00:00.000Z",
        "expiresAt": "2024-01-02T00:00:00.000Z"
      }
    ],
    "totalItems": 2,
    "totalPrice": 2160,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "Cart updated successfully",
  "success": true
}
```

#### Remove Item from Cart
```http
DELETE /cart/remove/:productId
Authorization: Bearer <access_token>
```

Response:
```json
{
  "statusCode": 200,
  "data": {
    "user": "user_id",
    "items": [],
    "totalItems": 0,
    "totalPrice": 0,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "Item removed from cart successfully",
  "success": true
}
```

#### Clear Entire Cart
```http
DELETE /cart/clear
Authorization: Bearer <access_token>
```

Response:
```json
{
  "statusCode": 200,
  "data": {
    "user": "user_id",
    "items": [],
    "totalItems": 0,
    "totalPrice": 0,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "Cart cleared successfully",
  "success": true
}
```

#### Get Cart Summary
```http
GET /cart/summary
Authorization: Bearer <access_token>
```

Response:
```json
{
  "statusCode": 200,
  "data": {
    "totalItems": 3,
    "totalPrice": 270,
    "itemCount": 2
  },
  "message": "Cart summary retrieved successfully",
  "success": true
}
```

#### Clean Expired Items (Admin Only)
```http
POST /cart/clean-expired
Authorization: Bearer <admin_access_token>
```

Response:
```json
{
  "statusCode": 200,
  "data": {
    "modifiedCount": 5,
    "matchedCount": 5
  },
  "message": "Expired cart items cleaned successfully",
  "success": true
}
```

### Admin Cart Management Endpoints

#### Get All User Carts (Admin Only)
```http
GET /cart/admin/all?page=1&limit=10&search=john
Authorization: Bearer <admin_access_token>
```

Query Parameters:
- page: number (optional, default: 1)
- limit: number (optional, default: 10)
- search: string (optional, search by user name or email)

Response:
```json
{
  "statusCode": 200,
  "data": {
    "carts": [
      {
        "user": {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "user"
        },
        "items": [
          {
            "product": {
              "_id": "product_id",
              "name": "Gaming Laptop",
              "price": 1200,
              "photos": ["url1", "url2"],
              "sizes": ["13 inch", "15 inch", "17 inch"],
              "colors": ["Black", "Silver", "Space Gray"]
            },
            "quantity": 1,
            "price": 1080,
            "selectedSize": "15 inch",
            "selectedColor": "Black",
            "addedAt": "2024-01-01T00:00:00.000Z",
            "expiresAt": "2024-01-02T00:00:00.000Z"
          }
        ],
        "totalItems": 1,
        "totalPrice": 1080,
        "lastUpdated": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCarts": 50,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "All user carts retrieved successfully",
  "success": true
}
```

#### Get Specific User's Cart (Admin Only)
```http
GET /cart/admin/user/:userId
Authorization: Bearer <admin_access_token>
```

Response:
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Gaming Laptop",
          "price": 1200,
          "photos": ["url1", "url2"],
          "sizes": ["13 inch", "15 inch", "17 inch"],
          "colors": ["Black", "Silver", "Space Gray"],
          "stock": 47
        },
        "quantity": 1,
        "price": 1080,
        "selectedSize": "15 inch",
        "selectedColor": "Black",
        "addedAt": "2024-01-01T00:00:00.000Z",
        "expiresAt": "2024-01-02T00:00:00.000Z"
      }
    ],
    "totalItems": 1,
    "totalPrice": 1080,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "User cart retrieved successfully",
  "success": true
}
```

#### Remove Item from User's Cart (Admin Only)
```http
DELETE /cart/admin/user/:userId/item/:productId
Authorization: Bearer <admin_access_token>
```

Response:
```json
{
  "statusCode": 200,
  "data": {
    "user": "user_id",
    "items": [],
    "totalItems": 0,
    "totalPrice": 0,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "Item removed from user's cart successfully",
  "success": true
}
```

#### Clear User's Cart (Admin Only)
```http
DELETE /cart/admin/user/:userId/clear
Authorization: Bearer <admin_access_token>
```

Response:
```json
{
  "statusCode": 200,
  "data": {
    "user": "user_id",
    "items": [],
    "totalItems": 0,
    "totalPrice": 0,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "User cart cleared successfully",
  "success": true
}
```

#### Update User's Cart Item Quantity (Admin Only)
```http
PUT /cart/admin/user/:userId/item/:productId
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "quantity": 3
}
```

Response:
```json
{
  "statusCode": 200,
  "data": {
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Gaming Laptop",
          "price": 1200,
          "photos": ["url1", "url2"],
          "sizes": ["13 inch", "15 inch", "17 inch"],
          "colors": ["Black", "Silver", "Space Gray"],
          "stock": 45
        },
        "quantity": 3,
        "price": 1080,
        "selectedSize": "15 inch",
        "selectedColor": "Black",
        "addedAt": "2024-01-01T00:00:00.000Z",
        "expiresAt": "2024-01-02T00:00:00.000Z"
      }
    ],
    "totalItems": 3,
    "totalPrice": 3240,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "User cart item updated successfully",
  "success": true
}
```

### Error Response Examples

#### Invalid Size Selection
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Invalid size. Available sizes: S, M, L, XL",
  "success": false
}
```

#### Invalid Color Selection
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Invalid color. Available colors: Red, Blue, Green, Black",
  "success": false
}
```

#### Insufficient Stock
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Insufficient stock available",
  "success": false
}
```

#### Product Not Found
```json
{
  "statusCode": 404,
  "data": null,
  "message": "Product not found",
  "success": false
}
```

#### Item Not Found in Cart
```json
{
  "statusCode": 404,
  "data": null,
  "message": "Item not found in cart",
  "success": false
}
```

## 🧪 Testing the API

### 🚀 Quick Test Setup
```bash
# 1. Start the server
npm run dev

# 2. Run comprehensive tests
node test/run-all-tests.js

# 3. Test specific features
node test/test-login.js
node test/test-cart-functionality.js
node test/test-admin-cart-management.js
```

### 📋 Test Coverage
- ✅ **Authentication Tests**: Login, registration, token validation
- ✅ **User Management Tests**: CRUD operations, role validation
- ✅ **Product Tests**: CRUD operations, photo uploads, size/color
- ✅ **Order Tests**: Order creation, status updates, photo uploads
- ✅ **Cart Tests**: Add/remove items, stock management, expiration
- ✅ **Admin Tests**: Cart management, user administration
- ✅ **Photo Upload Tests**: Product and order photo uploads
- ✅ **Error Handling Tests**: Validation and error responses

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

#### Cart Management:

```bash
# Get user's cart
curl -X GET http://localhost:8000/api/v1/cart \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Add item to cart with size and color
curl -X POST http://localhost:8000/api/v1/cart/add \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": "PRODUCT_ID", "quantity": 2, "selectedSize": "M", "selectedColor": "Red"}'

# Update cart item quantity
curl -X PUT http://localhost:8000/api/v1/cart/update \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": "PRODUCT_ID", "quantity": 3}'

# Update cart item size and color
curl -X PUT http://localhost:8000/api/v1/cart/update \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": "PRODUCT_ID", "selectedSize": "L", "selectedColor": "Blue"}'

# Remove item from cart
curl -X DELETE http://localhost:8000/api/v1/cart/remove/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Clear entire cart
curl -X DELETE http://localhost:8000/api/v1/cart/clear \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get cart summary
curl -X GET http://localhost:8000/api/v1/cart/summary \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Admin: Clean expired items
curl -X POST http://localhost:8000/api/v1/cart/clean-expired \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Admin: Get all user carts
curl -X GET "http://localhost:8000/api/v1/cart/admin/all?page=1&limit=10&search=john" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Admin: Get specific user's cart
curl -X GET http://localhost:8000/api/v1/cart/admin/user/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Admin: Remove item from user's cart
curl -X DELETE http://localhost:8000/api/v1/cart/admin/user/USER_ID/item/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Admin: Clear user's cart
curl -X DELETE http://localhost:8000/api/v1/cart/admin/user/USER_ID/clear \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Admin: Update user's cart item quantity
curl -X PUT http://localhost:8000/api/v1/cart/admin/user/USER_ID/item/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
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
zoomit-backend/
├── 📁 src/                          # Source code
│   ├── 📁 controllers/              # Route controllers
│   │   ├── category.controller.js   # Category management
│   │   ├── order.controller.js      # Order processing
│   │   ├── product.controller.js    # Product management
│   │   ├── user.controller.js       # User management
│   │   └── cart.controller.js       # Shopping cart logic
│   ├── 📁 middlewares/              # Custom middleware
│   │   ├── admin.middleware.js      # Admin role validation
│   │   ├── auth.middleware.js       # JWT authentication
│   │   ├── error.middleware.js      # Error handling
│   │   └── multer.middleware.js     # File upload handling
│   ├── 📁 models/                   # Database models
│   │   ├── category.model.js        # Category schema
│   │   ├── order.model.js           # Order schema
│   │   ├── product.model.js         # Product schema
│   │   ├── review.model.js          # Review schema
│   │   ├── user.model.js            # User schema
│   │   └── cart.model.js            # Cart schema
│   ├── 📁 routes/                   # API routes
│   │   ├── category.route.js        # Category endpoints
│   │   ├── order.route.js           # Order endpoints
│   │   ├── product.route.js         # Product endpoints
│   │   ├── user.route.js            # User endpoints
│   │   └── cart.route.js            # Cart endpoints
│   ├── 📁 utils/                    # Utility functions
│   │   ├── ApiError.js              # Custom error class
│   │   ├── ApiResponse.js           # Standardized responses
│   │   ├── asyncHandler.js          # Async error handling
│   │   └── cloudinary.js            # Image upload service
│   ├── 📁 db/                       # Database configuration
│   │   └── index.js                 # MongoDB connection
│   ├── app.js                       # Express app configuration
│   ├── constents.js                 # Application constants
│   └── index.js                     # Server entry point
├── 📁 test/                         # Test files
│   ├── test-*.js                    # Individual test scripts
│   ├── run-all-tests.js             # Comprehensive test runner
│   └── README.md                    # Testing documentation
├── 📁 public/                       # Static files
│   └── 📁 temp/                     # Temporary uploads
├── 📄 package.json                  # Dependencies and scripts
├── 📄 .env                          # Environment variables
├── 📄 create-super-admin.js         # Super admin setup
├── 📄 clear-database.js             # Database cleanup
└── 📄 README.md                     # This file
```

### 🏗️ Architecture Overview

**MVC Pattern Implementation:**
- **Models**: MongoDB schemas with Mongoose ODM
- **Views**: JSON API responses (no frontend views)
- **Controllers**: Business logic and request handling

**Key Design Patterns:**
- **Middleware Pattern**: Authentication, authorization, error handling
- **Repository Pattern**: Database operations through models
- **Factory Pattern**: Standardized API responses
- **Strategy Pattern**: Role-based access control

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

# Test cart functionality
node test/test-cart-functionality.js
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

#### Cart Functionality Testing
```bash
# Test cart functionality
node test/test-cart-functionality.js

# Test cases include:
# - Cart creation and retrieval
# - Add items to cart with stock management
# - Update cart item quantities
# - Remove items from cart
# - Clear entire cart
# - Get cart summary
# - Automatic stock management
# - Cart expiration handling (1 day)
# - Error handling for invalid operations
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

### 🌐 Production Deployment

#### Option 1: Heroku Deployment
```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create Heroku app
heroku create your-app-name

# 4. Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set ACCESS_TOKEN_SECRET=your_production_secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloudinary_name
heroku config:set CLOUDINARY_API_KEY=your_cloudinary_key
heroku config:set CLOUDINARY_API_SECRET=your_cloudinary_secret

# 5. Deploy
git push heroku main

# 6. Create super admin
heroku run node create-super-admin.js
```

#### Option 2: DigitalOcean App Platform
```yaml
# .do/app.yaml
name: zoomit-backend
services:
- name: api
  source_dir: /
  github:
    repo: your-username/zoomit-backend
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: ${MONGODB_URI}
  - key: ACCESS_TOKEN_SECRET
    value: ${ACCESS_TOKEN_SECRET}
```

#### Option 3: AWS EC2 Deployment
```bash
# 1. Launch EC2 instance (Ubuntu 20.04 LTS)
# 2. Connect via SSH
ssh -i your-key.pem ubuntu@your-ec2-ip

# 3. Install Node.js and MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb

# 4. Clone and setup
git clone your-repo-url
cd zoomit-backend
npm install
npm install -g pm2

# 5. Setup environment
cp .env.example .env
# Edit .env with production values

# 6. Start with PM2
pm2 start src/index.js --name "zoomit-api"
pm2 startup
pm2 save
```

### 🔧 Production Configuration

#### Environment Variables
```env
# Production Environment
NODE_ENV=production
PORT=8000

# Database (Use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zoomit_prod

# JWT (Use strong, unique secrets)
ACCESS_TOKEN_SECRET=your_super_secure_production_secret_here
ACCESS_TOKEN_EXPIRY=7d

# Cloudinary (Production account)
CLOUDINARY_CLOUD_NAME=your_production_cloud_name
CLOUDINARY_API_KEY=your_production_api_key
CLOUDINARY_API_SECRET=your_production_api_secret

# CORS (Your frontend domain)
CORS_ORIGIN=https://your-frontend-domain.com
```

#### Security Checklist
- ✅ **Strong JWT Secrets**: Use cryptographically secure random strings
- ✅ **HTTPS Only**: Always use HTTPS in production
- ✅ **Environment Variables**: Never commit secrets to version control
- ✅ **Database Security**: Use MongoDB Atlas with IP whitelisting
- ✅ **CORS Configuration**: Restrict to your frontend domains only
- ✅ **Rate Limiting**: Implement rate limiting for API endpoints
- ✅ **Input Validation**: Validate all inputs on server side
- ✅ **Error Handling**: Don't expose sensitive information in errors

### 📊 Monitoring & Maintenance

#### Health Check Endpoint
```http
GET /health
```
Returns server status and basic information.

#### Logging
```bash
# View PM2 logs
pm2 logs zoomit-api

# View specific log file
tail -f /var/log/zoomit-api.log
```

#### Database Maintenance
```bash
# Backup database
mongodump --uri="your_mongodb_uri" --out=backup/

# Restore database
mongorestore --uri="your_mongodb_uri" backup/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the ISC License.

## ❓ Frequently Asked Questions

### 🔧 Technical Questions

**Q: How do I reset the database?**
```bash
node clear-database.js
```

**Q: How do I create a super admin?**
```bash
node create-super-admin.js
```

**Q: How do I fix database connection issues?**
```bash
node fix-database-complete.js
```

**Q: What's the difference between admin and super admin?**
- **Admin**: Can manage users, products, categories, orders, and carts
- **Super Admin**: Can do everything admin can do, plus create other admins

**Q: How do I test the API?**
```bash
# Run all tests
node test/run-all-tests.js

# Test specific features
node test/test-login.js
node test/test-cart-functionality.js
```

### 🚀 Deployment Questions

**Q: How do I deploy to Heroku?**
1. Create Heroku app: `heroku create your-app-name`
2. Set environment variables in Heroku dashboard
3. Deploy: `git push heroku main`
4. Create super admin: `heroku run node create-super-admin.js`

**Q: How do I use MongoDB Atlas?**
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create cluster and get connection string
3. Update `MONGODB_URI` in your `.env` file
4. Whitelist your IP address

**Q: How do I configure Cloudinary?**
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Add them to your `.env` file

### 🐛 Troubleshooting

**Q: Server won't start**
- Check if MongoDB is running
- Verify all environment variables are set
- Check port 8000 is not in use

**Q: Database connection failed**
- Verify MongoDB URI is correct
- Check if MongoDB service is running
- Ensure network connectivity

**Q: Photo uploads not working**
- Check Cloudinary credentials
- Verify file size limits
- Check multer configuration

**Q: Authentication errors**
- Verify JWT secret is set
- Check token expiry
- Ensure proper Authorization header format

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the FAQ section above**
2. **Search existing issues** in the repository
3. **Create a new issue** with:
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node.js version, etc.)
4. **Contact the development team** for urgent issues

### 📞 Contact Information
- **Repository**: [GitHub Issues](https://github.com/your-username/zoomit-backend/issues)
- **Email**: support@zoomit.com
- **Documentation**: This README file

---

## 🆕 Recent Updates

### New Features Added
- **Photo Upload Support**: Added photo upload functionality for products and orders
- **User Role Filtering**: Added role-based filtering and search for user management
- **User Management System**: Complete CRUD operations for user management with role-based permissions
- **Product Size and Color**: Added size and color properties to products with flexible input formats
- **Cart Management**: Complete shopping cart system with automatic stock management and expiration
- **Admin Cart Management**: Admins can view all user carts, manage specific user cart items, remove items, clear carts, and update quantities with automatic stock restoration
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

### Cart Management Capabilities
- ✅ Add items to cart with quantity validation
- ✅ Update cart item quantities
- ✅ Remove items from cart
- ✅ Clear entire cart
- ✅ Get cart summary and details
- ✅ Automatic stock management (reduce/restore)
- ✅ Cart item expiration (1 day)
- ✅ Price calculation with discounts
- ✅ User isolation (each user has own cart)
- ✅ Quantity limits (max 10 per product)
- ✅ Size and color selection for cart items
- ✅ Size and color validation against product options
- ✅ Update cart item size and color

### Testing Coverage
- ✅ Product photo upload testing
- ✅ Order photo upload testing
- ✅ User role filtering testing
- ✅ User management testing
- ✅ Product size and color testing
- ✅ Cart functionality testing
- ✅ Comprehensive cURL examples
- ✅ JavaScript/Fetch examples

## 🎯 Project Summary

### ✨ What You Get
- **Complete E-commerce Backend**: 37+ API endpoints covering all e-commerce functionality
- **Role-Based Security**: Three-tier permission system (User, Admin, Super Admin)
- **Advanced Features**: Photo uploads, shopping cart, order management, user administration
- **Production Ready**: Comprehensive error handling, validation, and security measures
- **Well Documented**: Detailed API documentation with examples and testing guides

### 🚀 Quick Start
```bash
# 1. Clone and install
git clone <repository-url>
cd zoomit-backend
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your credentials

# 3. Start the server
npm run dev

# 4. Create super admin
node create-super-admin.js

# 5. Test the API
node test/run-all-tests.js
```

### 📊 Key Statistics
- **37 API Endpoints** across 6 categories
- **6 Database Models** with relationships
- **12 Test Scripts** for comprehensive coverage
- **3 User Roles** with granular permissions
- **5 Photo Upload Types** with Cloudinary integration
- **Complete Admin Dashboard** functionality

### 🎉 Ready to Use
This backend is production-ready and can power any e-commerce application. Whether you're building a small online store or a large marketplace, ZoomIt Backend provides all the essential features you need.

**Happy Coding! 🎉**

---

<div align="center">
  <h3>⭐ Star this repository if you found it helpful!</h3>
  <p>Built with ❤️ using Node.js, Express.js, and MongoDB</p>
</div>
````
