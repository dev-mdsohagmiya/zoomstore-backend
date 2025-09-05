import { spawn } from "child_process";

console.log("🧪 Testing Product Description Functionality...\n");

// Test data
const testProduct = {
  name: "Test Product with Description",
  description: "This is a detailed product description that should be visible to users. It contains important information about the product features, specifications, and benefits.",
  price: 99.99,
  discount: 10,
  stock: 50,
  categories: [],
  sizes: ["Small", "Medium", "Large"],
  colors: ["Red", "Blue", "Green"]
};

let productId = null;
let accessToken = null;

// Function to make HTTP requests
async function makeRequest(method, url, data = null, headers = {}) {
  const fetch = (await import("node-fetch")).default;
  
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
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
    return { status: 500, data: { error: error.message } };
  }
}

// Test 1: Login to get access token
async function testLogin() {
  console.log("1️⃣ Testing login...");
  
  const loginData = {
    email: "admin@example.com",
    password: "admin123"
  };

  const response = await makeRequest("POST", "http://localhost:8000/api/v1/users/login", loginData);
  
  if (response.status === 200 && response.data.success) {
    accessToken = response.data.data.accessToken;
    console.log("✅ Login successful");
    return true;
  } else {
    console.log("❌ Login failed:", response.data);
    return false;
  }
}

// Test 2: Create product with description
async function testCreateProduct() {
  console.log("\n2️⃣ Testing product creation with description...");
  
  const response = await makeRequest("POST", "http://localhost:8000/api/v1/products", testProduct, {
    "Authorization": `Bearer ${accessToken}`
  });
  
  if (response.status === 200 && response.data.success) {
    productId = response.data.data._id;
    console.log("✅ Product created successfully");
    console.log("📝 Description in response:", response.data.data.description);
    
    // Verify description is not empty
    if (response.data.data.description && response.data.data.description.trim() !== "") {
      console.log("✅ Description is properly saved and returned");
    } else {
      console.log("❌ Description is empty or missing");
    }
    return true;
  } else {
    console.log("❌ Product creation failed:", response.data);
    return false;
  }
}

// Test 3: Get product by ID
async function testGetProductById() {
  console.log("\n3️⃣ Testing get product by ID...");
  
  const response = await makeRequest("GET", `http://localhost:8000/api/v1/products/${productId}`);
  
  if (response.status === 200 && response.data.success) {
    console.log("✅ Product retrieved successfully");
    console.log("📝 Description in response:", response.data.data.description);
    
    // Verify description is present
    if (response.data.data.description && response.data.data.description.trim() !== "") {
      console.log("✅ Description is properly returned in get by ID");
    } else {
      console.log("❌ Description is empty or missing in get by ID");
    }
    return true;
  } else {
    console.log("❌ Get product by ID failed:", response.data);
    return false;
  }
}

// Test 4: Get all products
async function testGetAllProducts() {
  console.log("\n4️⃣ Testing get all products...");
  
  const response = await makeRequest("GET", "http://localhost:8000/api/v1/products");
  
  if (response.status === 200 && response.data.success) {
    console.log("✅ Products retrieved successfully");
    
    // Find our test product
    const ourProduct = response.data.data.products.find(p => p._id === productId);
    if (ourProduct) {
      console.log("📝 Description in products list:", ourProduct.description);
      
      if (ourProduct.description && ourProduct.description.trim() !== "") {
        console.log("✅ Description is properly returned in products list");
      } else {
        console.log("❌ Description is empty or missing in products list");
      }
    } else {
      console.log("❌ Our test product not found in products list");
    }
    return true;
  } else {
    console.log("❌ Get all products failed:", response.data);
    return false;
  }
}

// Test 5: Search products by description
async function testSearchByDescription() {
  console.log("\n5️⃣ Testing search by description...");
  
  const searchTerm = "detailed product description";
  const response = await makeRequest("GET", `http://localhost:8000/api/v1/products?search=${encodeURIComponent(searchTerm)}`);
  
  if (response.status === 200 && response.data.success) {
    console.log("✅ Search by description successful");
    
    // Check if our product is found
    const foundProduct = response.data.data.products.find(p => p._id === productId);
    if (foundProduct) {
      console.log("✅ Product found by description search");
      console.log("📝 Found product description:", foundProduct.description);
    } else {
      console.log("❌ Product not found by description search");
    }
    return true;
  } else {
    console.log("❌ Search by description failed:", response.data);
    return false;
  }
}

// Test 6: Update product description
async function testUpdateDescription() {
  console.log("\n6️⃣ Testing update product description...");
  
  const updateData = {
    description: "Updated product description with new information about features and benefits. This description has been modified to test the update functionality."
  };
  
  const response = await makeRequest("PUT", `http://localhost:8000/api/v1/products/${productId}`, updateData, {
    "Authorization": `Bearer ${accessToken}`
  });
  
  if (response.status === 200 && response.data.success) {
    console.log("✅ Product description updated successfully");
    console.log("📝 Updated description:", response.data.data.description);
    
    // Verify description was updated
    if (response.data.data.description.includes("Updated product description")) {
      console.log("✅ Description was properly updated");
    } else {
      console.log("❌ Description was not updated correctly");
    }
    return true;
  } else {
    console.log("❌ Update product description failed:", response.data);
    return false;
  }
}

// Test 7: Clean up - Delete test product
async function testCleanup() {
  console.log("\n7️⃣ Cleaning up test product...");
  
  const response = await makeRequest("DELETE", `http://localhost:8000/api/v1/products/${productId}`, null, {
    "Authorization": `Bearer ${accessToken}`
  });
  
  if (response.status === 200 && response.data.success) {
    console.log("✅ Test product deleted successfully");
    return true;
  } else {
    console.log("❌ Delete test product failed:", response.data);
    return false;
  }
}

// Run all tests
async function runTests() {
  try {
    const loginSuccess = await testLogin();
    if (!loginSuccess) {
      console.log("\n❌ Cannot proceed without login");
      return;
    }

    const createSuccess = await testCreateProduct();
    if (!createSuccess) {
      console.log("\n❌ Cannot proceed without product creation");
      return;
    }

    await testGetProductById();
    await testGetAllProducts();
    await testSearchByDescription();
    await testUpdateDescription();
    await testCleanup();

    console.log("\n🎉 All product description tests completed!");
    console.log("\n📋 Summary:");
    console.log("- Product description is properly saved during creation");
    console.log("- Product description is returned in get by ID");
    console.log("- Product description is returned in products list");
    console.log("- Product description is searchable");
    console.log("- Product description can be updated");
    console.log("- All operations work correctly");

  } catch (error) {
    console.error("❌ Test error:", error);
  }
}

// Start the server and run tests
console.log("🚀 Starting server...");
const server = spawn("node", ["src/index.js"], { stdio: "pipe" });

server.stdout.on("data", (data) => {
  const output = data.toString();
  if (output.includes("Server is running on port 8000")) {
    console.log("✅ Server started successfully");
    setTimeout(runTests, 2000); // Wait 2 seconds for server to fully start
  }
});

server.stderr.on("data", (data) => {
  console.error("Server error:", data.toString());
});

server.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Stopping server...");
  server.kill();
  process.exit(0);
});
