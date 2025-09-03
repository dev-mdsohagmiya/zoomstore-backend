// Test script to demonstrate the new error format
// Run with: node test-error-format.js

const BASE_URL = "http://localhost:8000/api/v1";

// Helper function to make API calls
async function apiCall(endpoint, method = "GET", data = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

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

// Test functions to demonstrate error formats
async function testErrorFormats() {
  console.log("🧪 Testing Error Formats...\n");

  // Test 1: 404 Error (Route not found)
  console.log("1️⃣ Testing 404 Error (Route not found):");
  const notFoundResult = await apiCall("/nonexistent-route");
  console.log("Status:", notFoundResult.status);
  console.log("Response:", JSON.stringify(notFoundResult.data, null, 2));
  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: 400 Error (Bad Request - missing fields)
  console.log("2️⃣ Testing 400 Error (Bad Request - missing fields):");
  const badRequestResult = await apiCall("/auth/register", "POST", {
    name: "Test User",
    // Missing email and password
  });
  console.log("Status:", badRequestResult.status);
  console.log("Response:", JSON.stringify(badRequestResult.data, null, 2));
  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: 409 Error (Conflict - duplicate email)
  console.log("3️⃣ Testing 409 Error (Conflict - duplicate email):");
  const conflictResult = await apiCall("/auth/register", "POST", {
    name: "Test User",
    email: "test@example.com", // This email might already exist
    password: "password123",
  });
  console.log("Status:", conflictResult.status);
  console.log("Response:", JSON.stringify(conflictResult.data, null, 2));
  console.log("\n" + "=".repeat(50) + "\n");

  // Test 4: 401 Error (Unauthorized - invalid credentials)
  console.log("4️⃣ Testing 401 Error (Unauthorized - invalid credentials):");
  const unauthorizedResult = await apiCall("/auth/login", "POST", {
    email: "nonexistent@example.com",
    password: "wrongpassword",
  });
  console.log("Status:", unauthorizedResult.status);
  console.log("Response:", JSON.stringify(unauthorizedResult.data, null, 2));
  console.log("\n" + "=".repeat(50) + "\n");

  console.log("✅ Error format testing completed!");
  console.log("\n📝 Key Features of the new error format:");
  console.log("- Consistent JSON structure");
  console.log("- Timestamp for each error");
  console.log("- Path information");
  console.log("- Stack trace in development mode");
  console.log("- Detailed error messages");
  console.log("- Proper HTTP status codes");
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === "undefined") {
  console.log("❌ This script requires Node.js 18+ or install node-fetch");
  console.log("Run: npm install node-fetch");
  process.exit(1);
}

// Run tests
testErrorFormats();

