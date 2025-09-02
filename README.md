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
    - [Refresh Token](#refresh-token)
    - [Logout User](#logout-user)
  - [User Management Endpoints](#user-management-endpoints)
    - [Update Profile](#update-profile)
    - [Get All Users (Admin)](#get-all-users-admin)
    - [Delete User (Admin)](#delete-user-admin)
    - [Create Admin (Super Admin)](#create-admin-super-admin)
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
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Product Management**: Admin-only product CRUD operations
- **Category Management**: Admin-only category management
- **Order Management**: Complete order lifecycle with status tracking
- **Review System**: Purchase-verified product reviews
- **File Upload**: Cloudinary integration for image uploads
- **Pagination**: Built-in pagination for all list endpoints
- **Search & Filtering**: Advanced product search and filtering

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
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=1h
   REFRESH_TOKEN_EXPIRY=7d

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # CORS
   CORS_ORIGIN=http://localhost:3000

   # Server
   PORT=8000
   ```

4. **Start the server**
   ```bash
   npm run dev
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

Response: Returns user data with access and refresh tokens (auto-login)
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

#### Refresh Token

```http
POST /auth/refresh-token
```

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
```

#### Get All Users (Admin)

```http
GET /users?page=1&limit=10
Authorization: Bearer <admin_access_token>
```

#### Delete User (Admin)

```http
DELETE /users/:id
Authorization: Bearer <admin_access_token>
```

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

Response: Returns admin data with access and refresh tokens (auto-login)
```

### Category Endpoints

#### Get All Categories

```http
GET /categories
```

#### Create Category (Admin)

```http
POST /categories
Authorization: Bearer <admin_access_token>
Content-Type: application/json

Body:
{
  "name": "Electronics"
}
```

#### Update Category (Admin)

```http
PUT /categories/:id
Authorization: Bearer <admin_access_token>
Content-Type: application/json

Body:
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
```

#### Update Product (Admin)

```http
PUT /products/:id
Authorization: Bearer <admin_access_token>
Content-Type: multipart/form-data

Body: (same as create, all fields optional)
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
Content-Type: application/json

Body:
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
curl -X POST http://localhost:8000/api/v1/auth/register \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=password123"
```

#### Login:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

#### Get all products:

```bash
curl -X GET http://localhost:8000/api/v1/products
```

#### Create a category (Admin):

```bash
curl -X POST http://localhost:8000/api/v1/categories \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Electronics"}'
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
- **admin**: Can manage products, categories, orders, and users
- **superadmin**: Can create/delete admins and manage all resources

### Access Levels:

- **Public**: Register, login, view products, view categories
- **User**: Profile management, order creation, reviews
- **Admin**: Product CRUD, category CRUD, order management, user management
- **Super Admin**: Admin creation, full system access

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

## 🔧 Environment Variables

Make sure to set up all required environment variables in your `.env` file:

- `MONGODB_URI`: MongoDB connection string
- `ACCESS_TOKEN_SECRET`: JWT access token secret
- `REFRESH_TOKEN_SECRET`: JWT refresh token secret
- `ACCESS_TOKEN_EXPIRY`: Access token expiry time
- `REFRESH_TOKEN_EXPIRY`: Refresh token expiry time
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

**Happy Coding! 🎉**
