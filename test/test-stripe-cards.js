import { spawn } from "child_process";
import fetch from "node-fetch";

const BASE_URL = "http://localhost:8000/api/v1";
let userToken = "";
let userId = "";

// Stripe test cards
const testCards = {
  success: {
    number: "4242424242424242",
    expiry: "12/25",
    cvc: "123",
    zip: "12345",
    description: "Successful Payment",
  },
  decline: {
    number: "4000000000000002",
    expiry: "12/25",
    cvc: "123",
    zip: "12345",
    description: "Declined Payment",
  },
  insufficientFunds: {
    number: "4000000000009995",
    expiry: "12/25",
    cvc: "123",
    zip: "12345",
    description: "Insufficient Funds",
  },
  expired: {
    number: "4000000000000069",
    expiry: "12/20",
    cvc: "123",
    zip: "12345",
    description: "Expired Card",
  },
  authenticationRequired: {
    number: "4000002500003155",
    expiry: "12/25",
    cvc: "123",
    zip: "12345",
    description: "3D Secure Required",
  },
  visa: {
    number: "4242424242424242",
    expiry: "12/25",
    cvc: "123",
    zip: "12345",
    description: "Visa Card",
  },
  mastercard: {
    number: "5555555555554444",
    expiry: "12/25",
    cvc: "123",
    zip: "12345",
    description: "Mastercard",
  },
  amex: {
    number: "378282246310005",
    expiry: "12/25",
    cvc: "1234",
    zip: "12345",
    description: "American Express",
  },
};

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

async function testIntegratedOrderWithCard(cardInfo) {
  console.log(`\n💳 Testing with ${cardInfo.description}...`);
  console.log(`   Card: ${cardInfo.number}`);
  console.log(`   Expiry: ${cardInfo.expiry}`);
  console.log(`   CVC: ${cardInfo.cvc}`);

  const orderData = {
    items: [
      {
        product: "68baca89c7382f48152df474", // Valid product ID
        qty: 1,
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
    const orderId = response.data.data.order._id;
    const paymentId = response.data.data.payment.paymentId;
    const clientSecret = response.data.data.payment.clientSecret;

    console.log(`   ✅ Order created successfully`);
    console.log(`   📦 Order ID: ${orderId}`);
    console.log(`   💳 Payment ID: ${paymentId}`);
    console.log(`   💵 Amount: $${response.data.data.order.totalPrice}`);
    console.log(`   🔑 Client Secret: ${clientSecret}`);

    // Test payment confirmation
    const confirmResponse = await makeRequest(
      `/payments/confirm/${paymentId}`,
      "POST",
      null,
      userToken
    );

    if (confirmResponse.status === 200 && confirmResponse.data.sucess) {
      console.log(`   ✅ Payment confirmed successfully`);
      console.log(`   📊 Payment Status: ${confirmResponse.data.data.status}`);
      console.log(
        `   📦 Order Status: ${confirmResponse.data.data.orderStatus}`
      );
    } else {
      console.log(
        `   ❌ Payment confirmation failed:`,
        confirmResponse.data.message
      );
    }

    return true;
  } else {
    console.log(`   ❌ Order creation failed:`, response.data.message);
    return false;
  }
}

async function testAllStripeCards() {
  console.log("🚀 Starting Stripe Test Cards Testing...\n");

  const results = [];

  for (const [cardType, cardInfo] of Object.entries(testCards)) {
    const result = await testIntegratedOrderWithCard(cardInfo);
    results.push({
      cardType,
      description: cardInfo.description,
      success: result,
    });
  }

  return results;
}

async function testPaymentHistory() {
  console.log("\n📜 Testing payment history...");
  const response = await makeRequest(
    "/payments/history",
    "GET",
    null,
    userToken
  );

  if (response.status === 200 && response.data.sucess) {
    console.log("✅ Payment history retrieved successfully");
    console.log(`📊 Total Payments: ${response.data.data.payments.length}`);
    return true;
  } else {
    console.log("❌ Get payment history failed:", response.data);
    return false;
  }
}

async function runTests() {
  console.log("🧪 Starting Comprehensive Stripe Test Cards Testing...\n");

  // Login first
  const loginSuccess = await testUserLogin();
  if (!loginSuccess) {
    console.log("❌ Cannot proceed without login");
    return;
  }

  // Test all Stripe cards
  const cardResults = await testAllStripeCards();

  // Test payment history
  await testPaymentHistory();

  // Summary
  console.log("\n🎯 Test Results Summary:");
  console.log("=" * 50);

  let passed = 0;
  let total = cardResults.length;

  cardResults.forEach((result) => {
    const status = result.success ? "✅" : "❌";
    console.log(
      `${status} ${result.description}: ${result.success ? "PASSED" : "FAILED"}`
    );
    if (result.success) passed++;
  });

  console.log("=" * 50);
  console.log(
    `🎯 Overall Results: ${passed}/${total} card tests passed (${Math.round((passed / total) * 100)}%)`
  );

  if (passed === total) {
    console.log("🎉 All Stripe test cards working perfectly!");
  } else {
    console.log("⚠️  Some test cards failed. Check the errors above.");
  }

  console.log("\n💡 Test Cards Used:");
  Object.entries(testCards).forEach(([type, card]) => {
    console.log(`   ${card.description}: ${card.number}`);
  });
}

// Run the tests
runTests().catch(console.error);
