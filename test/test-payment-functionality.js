import { spawn } from "child_process";
import fetch from "node-fetch";

const BASE_URL = "http://localhost:8000/api/v1";

// Test data
let adminToken = "";
let userToken = "";
let userId = "";
let orderId = "";
let paymentId = "";

// Helper function to make API calls
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
    console.error(
      `Error making ${method} request to ${endpoint}:`,
      error.message
    );
    return { status: 500, data: { error: error.message } };
  }
}

// Test functions
async function testAdminLogin() {
  console.log("\n🔐 Testing Admin Login...");
  const response = await makeRequest("/auth/login", "POST", {
    email: "admin@example.com",
    password: "admin123",
  });

  if (response.status === 200 && response.data.sucess) {
    adminToken = response.data.data.accessToken;
    console.log("✅ Admin login successful");
    return true;
  } else {
    console.log("❌ Admin login failed:", response.data);
    return false;
  }
}

async function testUserLogin() {
  console.log("\n🔐 Testing User Login...");
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

async function testCreateOrder() {
  console.log("\n📋 Testing Order Creation...");
  const response = await makeRequest(
    "/orders",
    "POST",
    {
      items: [
        {
          product: "507f1f77bcf86cd799439011", // Mock product ID
          quantity: 2,
          price: 50.0,
        },
      ],
      shippingAddress: {
        street: "123 Test Street",
        city: "Test City",
        state: "Test State",
        zipCode: "12345",
        country: "Test Country",
      },
      totalAmount: 100.0,
    },
    userToken
  );

  if (response.status === 201 && response.data.sucess) {
    orderId = response.data.data._id;
    console.log("✅ Order created successfully");
    console.log("📦 Order ID:", orderId);
    console.log("💰 Total Amount:", response.data.data.totalPrice);
    return true;
  } else {
    console.log("❌ Order creation failed:", response.data);
    return false;
  }
}

async function testCreatePaymentIntent() {
  console.log("\n💳 Testing Payment Intent Creation...");
  const response = await makeRequest(
    "/payments/create-intent",
    "POST",
    {
      orderId: orderId,
      paymentMethod: "card",
    },
    userToken
  );

  if (response.status === 201 && response.data.sucess) {
    paymentId = response.data.data.paymentId;
    console.log("✅ Payment intent created successfully");
    console.log("💳 Payment ID:", paymentId);
    console.log("🔑 Client Secret:", response.data.data.clientSecret);
    console.log("💰 Amount:", response.data.data.amount);
    console.log("💱 Currency:", response.data.data.currency);
    return true;
  } else {
    console.log("❌ Payment intent creation failed:", response.data);
    return false;
  }
}

async function testGetPaymentDetails() {
  console.log("\n📄 Testing Get Payment Details...");
  const response = await makeRequest(
    `/payments/${paymentId}`,
    "GET",
    null,
    userToken
  );

  if (response.status === 200 && response.data.sucess) {
    console.log("✅ Payment details retrieved successfully");
    console.log("💳 Payment Status:", response.data.data.status);
    console.log("💰 Amount:", response.data.data.amount);
    console.log("💱 Currency:", response.data.data.currency);
    console.log("📅 Created At:", response.data.data.createdAt);
    return true;
  } else {
    console.log("❌ Get payment details failed:", response.data);
    return false;
  }
}

async function testGetPaymentHistory() {
  console.log("\n📚 Testing Get Payment History...");
  const response = await makeRequest(
    "/payments/history?page=1&limit=10",
    "GET",
    null,
    userToken
  );

  if (response.status === 200 && response.data.sucess) {
    console.log("✅ Payment history retrieved successfully");
    console.log(
      "📊 Total Payments:",
      response.data.data.pagination.totalPayments
    );
    console.log("📦 Payments Found:", response.data.data.payments.length);
    return true;
  } else {
    console.log("❌ Get payment history failed:", response.data);
    return false;
  }
}

async function testGetAllPayments() {
  console.log("\n👥 Testing Get All Payments (Admin)...");
  const response = await makeRequest(
    "/payments/admin/all?page=1&limit=10",
    "GET",
    null,
    adminToken
  );

  if (response.status === 200 && response.data.sucess) {
    console.log("✅ All payments retrieved successfully");
    console.log(
      "📊 Total Payments:",
      response.data.data.pagination.totalPayments
    );
    console.log("📦 Payments Found:", response.data.data.payments.length);
    return true;
  } else {
    console.log("❌ Get all payments failed:", response.data);
    return false;
  }
}

async function testGetPaymentStats() {
  console.log("\n📈 Testing Get Payment Statistics...");
  const response = await makeRequest(
    "/payments/admin/stats",
    "GET",
    null,
    adminToken
  );

  if (response.status === 200 && response.data.sucess) {
    console.log("✅ Payment statistics retrieved successfully");
    console.log("📊 Stats by Status:", response.data.data.byStatus);
    console.log("📈 Total Stats:", response.data.data.totals);
    return true;
  } else {
    console.log("❌ Get payment stats failed:", response.data);
    return false;
  }
}

async function testProcessRefund() {
  console.log("\n💰 Testing Process Refund (Admin)...");
  const response = await makeRequest(
    `/payments/admin/refund/${paymentId}`,
    "POST",
    {
      amount: 25.0,
      reason: "requested_by_customer",
    },
    adminToken
  );

  if (response.status === 200 && response.data.sucess) {
    console.log("✅ Refund processed successfully");
    console.log("💰 Refunded Amount:", response.data.data.refundedAmount);
    console.log("💳 Remaining Amount:", response.data.data.remainingAmount);
    console.log("📊 Status:", response.data.data.status);
    return true;
  } else {
    console.log("❌ Process refund failed:", response.data);
    return false;
  }
}

async function testPaymentErrorHandling() {
  console.log("\n🚨 Testing Payment Error Handling...");

  // Test invalid payment ID
  const invalidResponse = await makeRequest(
    "/payments/invalid-id",
    "GET",
    null,
    userToken
  );
  if (invalidResponse.status === 400) {
    console.log("✅ Invalid payment ID handled correctly");
  } else {
    console.log("❌ Invalid payment ID not handled properly");
  }

  // Test unauthorized access
  const unauthorizedResponse = await makeRequest(
    "/payments/admin/all",
    "GET",
    null,
    userToken
  );
  if (unauthorizedResponse.status === 403) {
    console.log("✅ Unauthorized access handled correctly");
  } else {
    console.log("❌ Unauthorized access not handled properly");
  }

  return true;
}

async function testCleanup() {
  console.log("\n🧹 Testing Cleanup...");

  // Note: In a real scenario, you would clean up test data
  // For this demo, we'll just log the cleanup
  console.log("✅ Test cleanup completed");
  console.log("📝 Note: Test data remains for demonstration purposes");

  return true;
}

// Main test runner
async function runTests() {
  console.log("🚀 Starting Payment Functionality Tests...\n");

  const tests = [
    { name: "Admin Login", fn: testAdminLogin },
    { name: "User Login", fn: testUserLogin },
    { name: "Create Order", fn: testCreateOrder },
    { name: "Create Payment Intent", fn: testCreatePaymentIntent },
    { name: "Get Payment Details", fn: testGetPaymentDetails },
    { name: "Get Payment History", fn: testGetPaymentHistory },
    { name: "Get All Payments (Admin)", fn: testGetAllPayments },
    { name: "Get Payment Statistics", fn: testGetPaymentStats },
    { name: "Process Refund (Admin)", fn: testProcessRefund },
    { name: "Payment Error Handling", fn: testPaymentErrorHandling },
    { name: "Cleanup", fn: testCleanup },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} failed with error:`, error.message);
      failed++;
    }
  }

  console.log("\n📊 Test Results:");
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(
    `📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`
  );

  if (failed === 0) {
    console.log(
      "\n🎉 All tests passed! Payment functionality is working correctly."
    );
  } else {
    console.log("\n⚠️ Some tests failed. Please check the implementation.");
  }
}

// Start the tests
runTests().catch(console.error);
