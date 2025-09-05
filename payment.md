# 💳 Payment Integration Guide

## 🚀 Complete Frontend Checkout Implementation

এই guide টি আপনাকে দেখাবে কিভাবে আমাদের payment system এর সাথে frontend integrate করবেন।

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [API Endpoints Overview](#api-endpoints-overview)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Response Properties Explained](#response-properties-explained)
5. [Frontend Code Examples](#frontend-code-examples)
6. [Error Handling](#error-handling)
7. [Testing Guide](#testing-guide)
8. [Production Deployment](#production-deployment)

---

## 🔧 Prerequisites

### Required Packages

```bash
# React/Next.js
npm install @stripe/stripe-js @stripe/react-stripe-js

# Vue.js
npm install @stripe/stripe-js

# Angular
npm install @stripe/stripe-js

# Vanilla JavaScript
npm install @stripe/stripe-js
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TYooMQauvdEDq54NiTphI7jx
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 🌐 API Endpoints Overview

### 1. Integrated Order & Payment Creation

```http
POST /orders/with-payment
Authorization: Bearer <token>
Content-Type: application/json

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
  "paymentMethod": "card"
}
```

### 2. Payment Confirmation

```http
POST /payments/confirm/:paymentId
Authorization: Bearer <token>
```

### 3. Get Payment Details

```http
GET /payments/:paymentId
Authorization: Bearer <token>
```

---

## 🛠️ Step-by-Step Implementation

### Step 1: Initialize Stripe

```javascript
// utils/stripe.js
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default stripePromise;
```

### Step 2: Create Checkout Component

```jsx
// components/Checkout.jsx
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutForm = ({ cartItems, shippingAddress, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Step 1: Create order with payment intent
      const orderResponse = await fetch("/api/v1/orders/with-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: shippingAddress,
          paymentMethod: "card",
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.sucess) {
        throw new Error(orderResult.message);
      }

      setOrderData(orderResult.data);

      // Step 2: Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        orderResult.data.payment.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: shippingAddress.name,
              email: shippingAddress.email,
              address: {
                line1: shippingAddress.address,
                city: shippingAddress.city,
                postal_code: shippingAddress.postalCode,
                country: shippingAddress.country,
              },
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      // Step 3: Confirm payment on backend
      const confirmResponse = await fetch(
        `/api/v1/payments/confirm/${orderResult.data.payment.paymentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const confirmResult = await confirmResponse.json();

      if (!confirmResult.sucess) {
        throw new Error(confirmResult.message);
      }

      // Success!
      onSuccess(confirmResult.data);
    } catch (error) {
      console.error("Payment failed:", error);
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-group">
        <label>Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="pay-button"
      >
        {loading
          ? "Processing..."
          : `Pay $${orderData?.order.totalPrice || "0.00"}`}
      </button>
    </form>
  );
};

const Checkout = ({ cartItems, shippingAddress, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        cartItems={cartItems}
        shippingAddress={shippingAddress}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default Checkout;
```

### Step 3: Use Checkout Component

```jsx
// pages/checkout.jsx
import React, { useState } from "react";
import Checkout from "../components/Checkout";

const CheckoutPage = () => {
  const [cartItems] = useState([
    {
      product: "68baca89c7382f48152df474",
      qty: 2,
    },
  ]);

  const [shippingAddress] = useState({
    name: "John Doe",
    email: "john@example.com",
    address: "123 Main St",
    city: "New York",
    postalCode: "10001",
    country: "USA",
  });

  const handleSuccess = (paymentData) => {
    console.log("Payment successful:", paymentData);
    // Redirect to success page
    window.location.href = "/success";
  };

  const handleError = (error) => {
    console.error("Payment failed:", error);
    // Show error message
    alert("Payment failed: " + error);
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <Checkout
        cartItems={cartItems}
        shippingAddress={shippingAddress}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default CheckoutPage;
```

---

## 📊 Response Properties Explained

### 1. Order Creation Response (`/orders/with-payment`)

```json
{
  "statusCode": 201,
  "data": {
    "order": {
      "_id": "68bad2f58dbbeb266a993498",
      "user": "68baca5bc7382f48152df461",
      "items": [
        {
          "product": "68baca89c7382f48152df474",
          "name": "Test Product",
          "qty": 2,
          "price": 50,
          "total": 100
        }
      ],
      "shippingAddress": {
        "address": "123 Main St",
        "city": "New York",
        "postalCode": "10001",
        "country": "USA"
      },
      "itemsPrice": 100,
      "shippingPrice": 10,
      "taxPrice": 10,
      "totalPrice": 120,
      "paymentMethod": "card",
      "status": "pending",
      "photos": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "payment": {
      "paymentId": "68bad2f68dbbeb266a99349f",
      "clientSecret": "pi_3S3ySJ2eZvKYlo2C1v1a7DqO_secret_07XZl114MrwFsqQb6Wruqi0gp",
      "amount": 120,
      "currency": "usd",
      "status": "pending",
      "stripePaymentIntentId": "pi_3S3ySJ2eZvKYlo2C1v1a7DqO"
    }
  },
  "message": "Order created successfully with payment intent",
  "sucess": true
}
```

#### Order Properties:

- **`_id`**: Unique order identifier
- **`user`**: User ID who created the order
- **`items`**: Array of order items with product details
- **`shippingAddress`**: Delivery address information
- **`itemsPrice`**: Total price of items (before shipping/tax)
- **`shippingPrice`**: Shipping cost
- **`taxPrice`**: Tax amount
- **`totalPrice`**: Final total amount
- **`paymentMethod`**: Payment method used
- **`status`**: Order status (pending, confirmed, shipped, etc.)
- **`photos`**: Array of uploaded photos
- **`createdAt`**: Order creation timestamp
- **`updatedAt`**: Last update timestamp

#### Payment Properties:

- **`paymentId`**: Unique payment identifier
- **`clientSecret`**: Stripe client secret for frontend
- **`amount`**: Payment amount in dollars
- **`currency`**: Payment currency (usd)
- **`status`**: Payment status (pending, succeeded, failed)
- **`stripePaymentIntentId`**: Stripe payment intent ID

### 2. Payment Confirmation Response (`/payments/confirm/:paymentId`)

```json
{
  "statusCode": 200,
  "data": {
    "paymentId": "68bad2f68dbbeb266a99349f",
    "status": "succeeded",
    "amount": 120,
    "currency": "usd",
    "orderId": "68bad2f58dbbeb266a993498",
    "orderStatus": "confirmed",
    "paymentMethodDetails": {
      "brand": "visa",
      "last4": "4242",
      "exp_month": 12,
      "exp_year": 2025,
      "funding": "credit"
    },
    "processedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Payment status updated successfully",
  "sucess": true
}
```

#### Confirmation Properties:

- **`paymentId`**: Payment identifier
- **`status`**: Final payment status
- **`amount`**: Confirmed payment amount
- **`currency`**: Payment currency
- **`orderId`**: Associated order ID
- **`orderStatus`**: Updated order status
- **`paymentMethodDetails`**: Card information
- **`processedAt`**: Payment processing timestamp

---

## 🎨 Frontend Code Examples

### React/Next.js Complete Example

```jsx
// components/CheckoutForm.jsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutForm = ({ cartItems, shippingAddress, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [step, setStep] = useState(1); // 1: Create Order, 2: Process Payment, 3: Confirm

  const createOrder = async () => {
    try {
      const response = await fetch("/api/v1/orders/with-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: shippingAddress,
          paymentMethod: "card",
        }),
      });

      const result = await response.json();

      if (!result.sucess) {
        throw new Error(result.message);
      }

      setOrderData(result.data);
      setStep(2);
      return result.data;
    } catch (error) {
      onError(error.message);
      throw error;
    }
  };

  const processPayment = async (orderData) => {
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        orderData.payment.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: shippingAddress.name,
              email: shippingAddress.email,
              address: {
                line1: shippingAddress.address,
                city: shippingAddress.city,
                postal_code: shippingAddress.postalCode,
                country: shippingAddress.country,
              },
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      onError(error.message);
      throw error;
    }
  };

  const confirmPayment = async (paymentId) => {
    try {
      const response = await fetch(`/api/v1/payments/confirm/${paymentId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      if (!result.sucess) {
        throw new Error(result.message);
      }

      return result.data;
    } catch (error) {
      onError(error.message);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Step 1: Create order
      if (step === 1) {
        await createOrder();
        return;
      }

      // Step 2: Process payment
      if (step === 2) {
        const paymentIntent = await processPayment(orderData);

        // Step 3: Confirm payment
        const confirmData = await confirmPayment(orderData.payment.paymentId);

        onSuccess(confirmData);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="order-summary">
        <h3>Order Summary</h3>
        {orderData && (
          <div className="order-details">
            <p>Items: ${orderData.order.itemsPrice}</p>
            <p>Shipping: ${orderData.order.shippingPrice}</p>
            <p>Tax: ${orderData.order.taxPrice}</p>
            <p>
              <strong>Total: ${orderData.order.totalPrice}</strong>
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        {step === 1 && (
          <div className="step-1">
            <h3>Step 1: Create Order</h3>
            <button type="submit" disabled={loading}>
              {loading ? "Creating Order..." : "Create Order"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step-2">
            <h3>Step 2: Payment Details</h3>
            <div className="form-group">
              <label>Card Details</label>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                  },
                }}
              />
            </div>

            <button type="submit" disabled={!stripe || loading}>
              {loading
                ? "Processing Payment..."
                : `Pay $${orderData?.order.totalPrice || "0.00"}`}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const Checkout = ({ cartItems, shippingAddress, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        cartItems={cartItems}
        shippingAddress={shippingAddress}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default Checkout;
```

### Vue.js Example

```vue
<!-- components/Checkout.vue -->
<template>
  <div class="checkout-container">
    <div class="order-summary">
      <h3>Order Summary</h3>
      <div v-if="orderData" class="order-details">
        <p>Items: ${{ orderData.order.itemsPrice }}</p>
        <p>Shipping: ${{ orderData.order.shippingPrice }}</p>
        <p>Tax: ${{ orderData.order.taxPrice }}</p>
        <p>
          <strong>Total: ${{ orderData.order.totalPrice }}</strong>
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="checkout-form">
      <div v-if="step === 1" class="step-1">
        <h3>Step 1: Create Order</h3>
        <button type="submit" :disabled="loading">
          {{ loading ? "Creating Order..." : "Create Order" }}
        </button>
      </div>

      <div v-if="step === 2" class="step-2">
        <h3>Step 2: Payment Details</h3>
        <div class="form-group">
          <label>Card Details</label>
          <div id="card-element"></div>
        </div>

        <button type="submit" :disabled="!stripe || loading">
          {{
            loading
              ? "Processing Payment..."
              : `Pay $${orderData?.order.totalPrice || "0.00"}`
          }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";

export default {
  name: "Checkout",
  props: {
    cartItems: Array,
    shippingAddress: Object,
  },
  data() {
    return {
      stripe: null,
      elements: null,
      cardElement: null,
      loading: false,
      orderData: null,
      step: 1,
    };
  },
  async mounted() {
    this.stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY);
    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create("card");
    this.cardElement.mount("#card-element");
  },
  methods: {
    async createOrder() {
      try {
        const response = await fetch("/api/v1/orders/with-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            items: this.cartItems,
            shippingAddress: this.shippingAddress,
            paymentMethod: "card",
          }),
        });

        const result = await response.json();

        if (!result.sucess) {
          throw new Error(result.message);
        }

        this.orderData = result.data;
        this.step = 2;
        return result.data;
      } catch (error) {
        this.$emit("error", error.message);
        throw error;
      }
    },

    async processPayment(orderData) {
      try {
        const { error, paymentIntent } = await this.stripe.confirmCardPayment(
          orderData.payment.clientSecret,
          {
            payment_method: {
              card: this.cardElement,
              billing_details: {
                name: this.shippingAddress.name,
                email: this.shippingAddress.email,
                address: {
                  line1: this.shippingAddress.address,
                  city: this.shippingAddress.city,
                  postal_code: this.shippingAddress.postalCode,
                  country: this.shippingAddress.country,
                },
              },
            },
          }
        );

        if (error) {
          throw new Error(error.message);
        }

        return paymentIntent;
      } catch (error) {
        this.$emit("error", error.message);
        throw error;
      }
    },

    async confirmPayment(paymentId) {
      try {
        const response = await fetch(`/api/v1/payments/confirm/${paymentId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await response.json();

        if (!result.sucess) {
          throw new Error(result.message);
        }

        return result.data;
      } catch (error) {
        this.$emit("error", error.message);
        throw error;
      }
    },

    async handleSubmit() {
      if (!this.stripe) return;

      this.loading = true;

      try {
        if (this.step === 1) {
          await this.createOrder();
          return;
        }

        if (this.step === 2) {
          const paymentIntent = await this.processPayment(this.orderData);
          const confirmData = await this.confirmPayment(
            this.orderData.payment.paymentId
          );

          this.$emit("success", confirmData);
        }
      } catch (error) {
        console.error("Checkout failed:", error);
        this.$emit("error", error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

---

## ⚠️ Error Handling

### Common Error Scenarios

```javascript
const handlePaymentError = (error) => {
  switch (error.type) {
    case "card_error":
      // Card was declined
      console.error("Card declined:", error.message);
      break;
    case "validation_error":
      // Invalid input
      console.error("Validation error:", error.message);
      break;
    case "api_error":
      // Stripe API error
      console.error("API error:", error.message);
      break;
    case "authentication_error":
      // Authentication failed
      console.error("Authentication error:", error.message);
      break;
    default:
      console.error("Unknown error:", error.message);
  }
};
```

### Error Response Format

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Payment failed: Card was declined",
  "success": false,
  "errors": [
    {
      "field": "payment_method",
      "message": "Card was declined"
    }
  ]
}
```

---

## 🧪 Testing Guide

### Test Cards for Development

```javascript
const testCards = {
  success: {
    number: "4242424242424242",
    expiry: "12/25",
    cvc: "123",
    zip: "12345",
  },
  decline: {
    number: "4000000000000002",
    expiry: "12/25",
    cvc: "123",
    zip: "12345",
  },
  insufficientFunds: {
    number: "4000000000009995",
    expiry: "12/25",
    cvc: "123",
    zip: "12345",
  },
  expired: {
    number: "4000000000000069",
    expiry: "12/20",
    cvc: "123",
    zip: "12345",
  },
};
```

### Testing Checklist

- [ ] Order creation with valid data
- [ ] Payment processing with test cards
- [ ] Error handling for declined cards
- [ ] Payment confirmation flow
- [ ] Order status updates
- [ ] Payment history retrieval
- [ ] Admin payment management

---

## 🚀 Production Deployment

### Environment Variables

```bash
# Production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api/v1
```

### Security Considerations

1. **Never expose secret keys** in frontend code
2. **Validate all inputs** on both frontend and backend
3. **Use HTTPS** in production
4. **Implement proper error handling**
5. **Log all payment activities**

### Monitoring

```javascript
// Add monitoring to your payment flow
const trackPaymentEvent = (event, data) => {
  // Send to your analytics service
  analytics.track(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};

// Usage
trackPaymentEvent("payment_initiated", {
  orderId: orderData.order._id,
  amount: orderData.order.totalPrice,
});
```

---

## 📞 Support

### API Documentation

- Complete API docs: `README.md`
- Test scripts: `test/` directory
- Manual testing guide: `test/test-payment-manual.md`

### Common Issues

1. **CORS errors**: Ensure API allows your domain
2. **Authentication errors**: Check JWT token validity
3. **Payment failures**: Verify Stripe keys and test cards
4. **Order creation fails**: Check product availability and stock

### Contact

- API Issues: Check server logs
- Payment Issues: Check Stripe Dashboard
- Frontend Issues: Check browser console

---

**🎉 Happy Coding!**

এই guide অনুসরণ করে আপনি একটি complete, production-ready checkout system implement করতে পারবেন!
