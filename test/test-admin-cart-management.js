import { spawn } from "child_process";
import fetch from "node-fetch";

const BASE_URL = "http://localhost:8000/api/v1";

// Test data
let adminToken = "";
let userToken = "";
let userId = "";
let productId = "";

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
  const response = await makeRequest("/users/auth/login", "POST", {
    email: "admin@example.com",
    password: "admin123",
  });

  if (response.status === 200 && response.data.success) {
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
  const response = await makeRequest("/users/auth/login", "POST", {
    email: "user@example.com",
    password: "user123",
  });

  if (response.status === 200 && response.data.success) {
    userToken = response.data.data.accessToken;
    userId = response.data.data.user._id;
    console.log("✅ User login successful");
    return true;
  } else {
    console.log("❌ User login failed:", response.data);
    return false;
  }
}

async function testCreateProduct() {
  console.log("\n📦 Testing Product Creation...");
  const response = await makeRequest(
    "/products",
    "POST",
    {
      name: "Test Product for Cart",
      description: "A test product for cart management",
      price: 100,
      stock: 10,
      sizes: ["S", "M", "L"],
      colors: ["Red", "Blue", "Green"],
    },
    adminToken
  );

  if (response.status === 201 && response.data.success) {
    productId = response.data.data._id;
    console.log("✅ Product created successfully");
    return true;
  } else {
    console.log("❌ Product creation failed:", response.data);
    return false;
  }
}

async function testUserAddToCart() {
  console.log("\n🛒 Testing User Add to Cart...");
  const response = await makeRequest(
    "/cart/add",
    "POST",
    {
      productId: productId,
      quantity: 2,
      selectedSize: "M",
      selectedColor: "Red",
    },
    userToken
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ Item added to cart successfully");
    console.log("📦 Cart items:", response.data.data.items.length);
    console.log("💰 Total price:", response.data.data.totalPrice);
    return true;
  } else {
    console.log("❌ Add to cart failed:", response.data);
    return false;
  }
}

async function testGetAllUserCarts() {
  console.log("\n👥 Testing Get All User Carts...");
  const response = await makeRequest(
    "/cart/admin/all?page=1&limit=10",
    "GET",
    null,
    adminToken
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ All user carts retrieved successfully");
    console.log("📊 Total carts:", response.data.data.pagination.totalCarts);
    console.log("📦 Carts found:", response.data.data.carts.length);
    return true;
  } else {
    console.log("❌ Get all user carts failed:", response.data);
    return false;
  }
}

async function testGetSpecificUserCart() {
  console.log("\n👤 Testing Get Specific User Cart...");
  const response = await makeRequest(
    `/cart/admin/user/${userId}`,
    "GET",
    null,
    adminToken
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ User cart retrieved successfully");
    console.log("👤 User:", response.data.data.user.name);
    console.log("📦 Items:", response.data.data.items.length);
    console.log("💰 Total:", response.data.data.totalPrice);
    return true;
  } else {
    console.log("❌ Get user cart failed:", response.data);
    return false;
  }
}

async function testAdminUpdateUserCartItem() {
  console.log("\n✏️ Testing Admin Update User Cart Item...");
  const response = await makeRequest(
    `/cart/admin/user/${userId}/item/${productId}`,
    "PUT",
    {
      quantity: 3,
    },
    adminToken
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ User cart item updated successfully");
    console.log("📦 New quantity:", response.data.data.items[0].quantity);
    console.log("💰 New total:", response.data.data.totalPrice);
    return true;
  } else {
    console.log("❌ Update user cart item failed:", response.data);
    return false;
  }
}

async function testAdminRemoveFromUserCart() {
  console.log("\n🗑️ Testing Admin Remove from User Cart...");
  const response = await makeRequest(
    `/cart/admin/user/${userId}/item/${productId}`,
    "DELETE",
    null,
    adminToken
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ Item removed from user cart successfully");
    console.log("📦 Remaining items:", response.data.data.items.length);
    console.log("💰 New total:", response.data.data.totalPrice);
    return true;
  } else {
    console.log("❌ Remove from user cart failed:", response.data);
    return false;
  }
}

async function testAdminClearUserCart() {
  console.log("\n🧹 Testing Admin Clear User Cart...");
  // First add an item back
  await makeRequest(
    "/cart/add",
    "POST",
    {
      productId: productId,
      quantity: 1,
    },
    userToken
  );

  const response = await makeRequest(
    `/cart/admin/user/${userId}/clear`,
    "DELETE",
    null,
    adminToken
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ User cart cleared successfully");
    console.log("📦 Items after clear:", response.data.data.items.length);
    console.log("💰 Total after clear:", response.data.data.totalPrice);
    return true;
  } else {
    console.log("❌ Clear user cart failed:", response.data);
    return false;
  }
}

async function testCleanup() {
  console.log("\n🧹 Testing Cleanup...");

  // Delete the test product
  if (productId) {
    await makeRequest(`/products/${productId}`, "DELETE", null, adminToken);
    console.log("✅ Test product deleted");
  }

  console.log("✅ Cleanup completed");
}

// Main test runner
async function runTests() {
  console.log("🚀 Starting Admin Cart Management Tests...\n");

  const tests = [
    { name: "Admin Login", fn: testAdminLogin },
    { name: "User Login", fn: testUserLogin },
    { name: "Create Product", fn: testCreateProduct },
    { name: "User Add to Cart", fn: testUserAddToCart },
    { name: "Get All User Carts", fn: testGetAllUserCarts },
    { name: "Get Specific User Cart", fn: testGetSpecificUserCart },
    { name: "Admin Update User Cart Item", fn: testAdminUpdateUserCartItem },
    { name: "Admin Remove from User Cart", fn: testAdminRemoveFromUserCart },
    { name: "Admin Clear User Cart", fn: testAdminClearUserCart },
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
      "\n🎉 All tests passed! Admin cart management is working correctly."
    );
  } else {
    console.log("\n⚠️ Some tests failed. Please check the implementation.");
  }
}

// Start the tests
runTests().catch(console.error);
