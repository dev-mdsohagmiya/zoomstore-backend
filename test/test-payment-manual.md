# 💳 Payment API Manual Testing Guide

This guide provides step-by-step instructions for manually testing the Stripe payment integration.

## 🚀 Prerequisites

1. **Server Running**: Ensure the backend server is running on `http://localhost:8000`
2. **Database Connected**: MongoDB should be connected and accessible
3. **Stripe Test Mode**: Using Stripe test credentials (no real money involved)

## 🔧 Test Environment Setup

### 1. Environment Variables

Make sure these are set in your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_51234567890abcdef
STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef
STRIPE_WEBHOOK_SECRET=whsec_test_1234567890abcdef
```

### 2. Test Cards

Use these Stripe test card numbers:

- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **Insufficient Funds**: `4000000000009995`
- **Expired Card**: `4000000000000069`

## 📋 Test Scenarios

### Scenario 1: Complete Payment Flow

#### Step 1: Login as User

```bash
curl -X POST http://localhost:8000/api/v1/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}'
```

**Expected Response:**

```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "Test User",
      "email": "user@example.com"
    }
  },
  "message": "User logged in successfully",
  "success": true
}
```

#### Step 2: Create an Order

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product": "PRODUCT_ID",
        "quantity": 2,
        "price": 50.00
      }
    ],
    "shippingAddress": {
      "street": "123 Test Street",
      "city": "Test City",
      "state": "Test State",
      "zipCode": "12345",
      "country": "Test Country"
    },
    "totalAmount": 100.00
  }'
```

#### Step 3: Create Payment Intent

```bash
curl -X POST http://localhost:8000/api/v1/payments/create-intent \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER_ID_FROM_STEP_2",
    "paymentMethod": "card"
  }'
```

**Expected Response:**

```json
{
  "statusCode": 201,
  "data": {
    "paymentId": "payment_id",
    "clientSecret": "pi_xxx_secret_xxx",
    "amount": 100.0,
    "currency": "usd",
    "status": "pending",
    "orderId": "order_id"
  },
  "message": "Payment intent created successfully",
  "success": true
}
```

#### Step 4: Get Payment Details

```bash
curl -X GET http://localhost:8000/api/v1/payments/PAYMENT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Step 5: Confirm Payment (Simulate Frontend)

```bash
curl -X POST http://localhost:8000/api/v1/payments/confirm/PAYMENT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Scenario 2: Admin Payment Management

#### Step 1: Login as Admin

```bash
curl -X POST http://localhost:8000/api/v1/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

#### Step 2: Get All Payments

```bash
curl -X GET "http://localhost:8000/api/v1/payments/admin/all?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

#### Step 3: Get Payment Statistics

```bash
curl -X GET http://localhost:8000/api/v1/payments/admin/stats \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

#### Step 4: Process Refund

```bash
curl -X POST http://localhost:8000/api/v1/payments/admin/refund/PAYMENT_ID \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25.00,
    "reason": "requested_by_customer"
  }'
```

### Scenario 3: Error Handling Tests

#### Test 1: Invalid Payment ID

```bash
curl -X GET http://localhost:8000/api/v1/payments/invalid-id \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Invalid payment ID",
  "success": false
}
```

#### Test 2: Unauthorized Access

```bash
curl -X GET http://localhost:8000/api/v1/payments/admin/all \
  -H "Authorization: Bearer USER_ACCESS_TOKEN"
```

**Expected Response:**

```json
{
  "statusCode": 403,
  "data": null,
  "message": "Access denied. Admin privileges required.",
  "success": false
}
```

#### Test 3: Missing Order ID

```bash
curl -X POST http://localhost:8000/api/v1/payments/create-intent \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethod": "card"}'
```

**Expected Response:**

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Order ID is required",
  "success": false
}
```

## 🔍 Frontend Integration Testing

### Using Stripe Elements (Frontend)

1. **Include Stripe.js**:

```html
<script src="https://js.stripe.com/v3/"></script>
```

2. **Initialize Stripe**:

```javascript
const stripe = Stripe("pk_test_51234567890abcdef");
```

3. **Create Payment Form**:

```javascript
const elements = stripe.elements();
const cardElement = elements.create("card");
cardElement.mount("#card-element");
```

4. **Handle Payment**:

```javascript
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: "Test User",
      email: "user@example.com",
    },
  },
});
```

## 📊 Expected Results

### Successful Payment Flow

1. ✅ Payment intent created
2. ✅ Client secret returned
3. ✅ Payment confirmed
4. ✅ Order status updated to "confirmed"
5. ✅ Payment status updated to "succeeded"

### Failed Payment Flow

1. ✅ Payment intent created
2. ✅ Client secret returned
3. ❌ Payment fails (test card)
4. ✅ Payment status updated to "failed"
5. ✅ Order remains unpaid

### Refund Flow

1. ✅ Refund processed
2. ✅ Payment status updated to "refunded"
3. ✅ Order status updated to "cancelled"
4. ✅ Refund amount tracked

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid API Key"

**Solution**: Check your Stripe secret key in environment variables

### Issue 2: "Order not found"

**Solution**: Ensure order exists and belongs to the authenticated user

### Issue 3: "Payment already exists"

**Solution**: Check if payment already exists for the order

### Issue 4: "Minimum amount not met"

**Solution**: Ensure order total is at least $0.50

## 📝 Test Checklist

- [ ] User can create payment intent
- [ ] Payment details can be retrieved
- [ ] Payment history is accessible
- [ ] Admin can view all payments
- [ ] Admin can process refunds
- [ ] Error handling works correctly
- [ ] Unauthorized access is blocked
- [ ] Payment status updates correctly
- [ ] Order status updates with payment
- [ ] Refund functionality works

## 🎯 Success Criteria

All tests should pass with:

- ✅ Correct HTTP status codes
- ✅ Proper error messages
- ✅ Valid JSON responses
- ✅ Appropriate data structure
- ✅ Security measures in place
- ✅ Database consistency maintained

---

**Note**: This is a test environment using Stripe test credentials. No real money is involved in these tests.
