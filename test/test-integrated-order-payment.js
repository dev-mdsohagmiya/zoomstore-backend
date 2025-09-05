import { spawn } from "child_process";
import fetch from "node-fetch";

const BASE_URL = "http://localhost:8000/api/v1";
let userToken = "";
let userId = "";
let orderId = "";
let paymentId = "";

async function makeRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null
) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error.message);
    return { status: 500, data: { error: error.message } };
  }
}

async function testUserLogin() {
  console.log("🔐 Testing user login...");
  const response = await makeRequest("/auth/login", "POST", {
    email: "test@example.com",
    password: "test123",
  });

  if (response.status === 200 && response.data.sucess) {
    userToken = response.data.data.accessToken;
    userId = response.data.data.user._id;
    console.log("✅ User login successful");
    return true;
  } else {
    console.log("❌ User login failed:", response.data);
    return false;
  }
}

async function testCreateIntegratedOrder() {
  console.log("🛒 Testing integrated order creation with payment...");

  const orderData = {
    items: [
      {
        product: "68baca89c7382f48152df474", // Valid product ID
        qty: 2,
      },
    ],
    shippingAddress: {
      address: "123 Test Street",
      city: "Test City",
      postalCode: "12345",
      country: "Test Country",
    },
    paymentMethod: "card",
  };

  const response = await makeRequest(
    "/orders/with-payment",
    "POST",
    orderData,
    userToken
  );

  if (response.status === 201 && response.data.sucess) {
    orderId = response.data.data.order._id;
    paymentId = response.data.data.payment.paymentId;
    console.log("✅ Integrated order creation successful");
    console.log("💰 Order ID:", orderId);
    console.log("💳 Payment ID:", paymentId);
    console.log("💵 Total Amount:", response.data.data.order.totalPrice);
    console.log("🔑 Client Secret:", response.data.data.payment.clientSecret);
    return true;
  } else {
    console.log("❌ Integrated order creation failed:", response.data);
    return false;
  }
}

async function testGetOrderDetails() {
  console.log("📋 Testing get order details...");
  const response = await makeRequest(
    `/orders/${orderId}`,
    "GET",
    null,
    userToken
  );

  if (response.status === 200 && response.data.sucess) {
    console.log("✅ Order details retrieved successfully");
    console.log("📦 Order Status:", response.data.data.status);
    console.log("💰 Total Price:", response.data.data.totalPrice);
    return true;
  } else {
    console.log("❌ Get order details failed:", response.data);
    return false;
  }
}

async function testGetPaymentDetails() {
  console.log("💳 Testing get payment details...");
  const response = await makeRequest(
    `/payments/${paymentId}`,
    "GET",
    null,
    userToken
  );

  if (response.status === 200 && response.data.sucess) {
    console.log("✅ Payment details retrieved successfully");
    console.log("💵 Payment Amount:", response.data.data.amount);
    console.log("📊 Payment Status:", response.data.data.status);
    console.log(
      "🔑 Stripe Intent ID:",
      response.data.data.stripePaymentIntentId
    );
    return true;
  } else {
    console.log("❌ Get payment details failed:", response.data);
    return false;
  }
}

async function testConfirmPayment() {
  console.log("✅ Testing payment confirmation...");
  const response = await makeRequest(
    `/payments/confirm/${paymentId}`,
    "POST",
    null,
    userToken
  );

  if (response.status === 200 && response.data.sucess) {
    console.log("✅ Payment confirmation successful");
    console.log("📊 Payment Status:", response.data.data.status);
    console.log("📦 Order Status:", response.data.data.orderStatus);
    return true;
  } else {
    console.log("❌ Payment confirmation failed:", response.data);
    return false;
  }
}

async function testGetPaymentHistory() {
  console.log("📜 Testing get payment history...");
  const response = await makeRequest(
    "/payments/history",
    "GET",
    null,
    userToken
  );

  if (response.status === 200 && response.data.sucess) {
    console.log("✅ Payment history retrieved successfully");
    console.log("📊 Total Payments:", response.data.data.payments.length);
    return true;
  } else {
    console.log("❌ Get payment history failed:", response.data);
    return false;
  }
}

async function runTests() {
  console.log("🚀 Starting Integrated Order and Payment Tests...\n");

  const tests = [
    { name: "User Login", fn: testUserLogin },
    { name: "Create Integrated Order", fn: testCreateIntegratedOrder },
    { name: "Get Order Details", fn: testGetOrderDetails },
    { name: "Get Payment Details", fn: testGetPaymentDetails },
    { name: "Confirm Payment", fn: testConfirmPayment },
    { name: "Get Payment History", fn: testGetPaymentHistory },
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    const result = await test.fn();
    if (result) {
      passed++;
    }
    console.log(
      `${result ? "✅" : "❌"} ${test.name}: ${result ? "PASSED" : "FAILED"}`
    );
  }

  console.log(
    `\n🎯 Test Results: ${passed}/${total} tests passed (${Math.round((passed / total) * 100)}%)`
  );

  if (passed === total) {
    console.log(
      "🎉 All tests passed! Integrated order and payment system is working perfectly!"
    );
  } else {
    console.log("⚠️  Some tests failed. Please check the errors above.");
  }
}

// Run the tests
runTests().catch(console.error);
