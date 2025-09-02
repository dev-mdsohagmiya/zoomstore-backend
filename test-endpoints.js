// Simple test script to verify API endpoints
// Run with: node test-endpoints.js

const BASE_URL = "http://localhost:8000/api/v1";

// Test data
const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

const testAdmin = {
  name: "Test Admin",
  email: "admin@example.com",
  password: "admin123",
};

const testCategory = {
  name: "Electronics",
};

const testProduct = {
  name: "Test Product",
  description: "This is a test product",
  price: 99.99,
  discount: 10,
  stock: 50,
};

// Helper function to make API calls
async function apiCall(endpoint, method = "GET", data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

// Test functions
async function testUserRegistration() {
  console.log("\n🧪 Testing User Registration...");
  const result = await apiCall("/auth/register", "POST", testUser);
  console.log("Status:", result.status);
  console.log("Response:", result.data);
  return result;
}

async function testUserLogin() {
  console.log("\n🧪 Testing User Login...");
  const result = await apiCall("/auth/login", "POST", {
    email: testUser.email,
    password: testUser.password,
  });
  console.log("Status:", result.status);
  console.log("Response:", result.data);
  return result;
}

async function testGetProducts() {
  console.log("\n🧪 Testing Get Products...");
  const result = await apiCall("/products");
  console.log("Status:", result.status);
  console.log("Response:", result.data);
  return result;
}

async function testGetCategories() {
  console.log("\n🧪 Testing Get Categories...");
  const result = await apiCall("/categories");
  console.log("Status:", result.status);
  console.log("Response:", result.data);
  return result;
}

async function testCreateCategory(token) {
  console.log("\n🧪 Testing Create Category (Admin)...");
  const result = await apiCall("/categories", "POST", testCategory, token);
  console.log("Status:", result.status);
  console.log("Response:", result.data);
  return result;
}

async function testCreateProduct(token) {
  console.log("\n🧪 Testing Create Product (Admin)...");
  const result = await apiCall("/products", "POST", testProduct, token);
  console.log("Status:", result.status);
  console.log("Response:", result.data);
  return result;
}

// Main test runner
async function runTests() {
  console.log("🚀 Starting API Tests...");
  console.log("Base URL:", BASE_URL);

  try {
    // Test public endpoints
    await testGetProducts();
    await testGetCategories();

    // Test user registration and login
    const registerResult = await testUserRegistration();
    const loginResult = await testUserLogin();

    if (loginResult.data && loginResult.data.data) {
      const accessToken = loginResult.data.data.accessToken;
      console.log("\n✅ User authentication successful!");
      console.log("Access Token:", accessToken.substring(0, 20) + "...");

      // Test protected endpoints
      await testCreateCategory(accessToken);
      await testCreateProduct(accessToken);
    }

    console.log("\n✅ All tests completed!");
    console.log("\n📝 Next Steps:");
    console.log("1. Create an admin user manually in the database");
    console.log("2. Test admin-only endpoints with admin token");
    console.log("3. Test order creation and management");
    console.log("4. Test review system");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === "undefined") {
  console.log("❌ This script requires Node.js 18+ or install node-fetch");
  console.log("Run: npm install node-fetch");
  process.exit(1);
}

// Run tests
runTests();
