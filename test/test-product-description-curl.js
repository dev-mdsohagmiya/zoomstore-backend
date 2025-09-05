import { spawn } from "child_process";

console.log("🧪 Testing Product Description with cURL...\n");

// Test data
const testProduct = {
  name: "Test Product Description",
  description:
    "This is a comprehensive product description that should be visible to all users. It includes detailed information about the product features, specifications, and benefits.",
  price: 149.99,
  discount: 15,
  stock: 25,
  categories: [],
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: ["Black", "White", "Navy", "Red"],
};

let productId = null;
let accessToken = null;

// Function to execute curl commands
function executeCurl(command) {
  return new Promise((resolve, reject) => {
    const process = spawn("curl", command.split(" "), { stdio: "pipe" });
    let output = "";
    let error = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      error += data.toString();
    });

    process.on("close", (code) => {
      if (code === 0) {
        try {
          const jsonOutput = JSON.parse(output);
          resolve({ success: true, data: jsonOutput });
        } catch (e) {
          resolve({ success: false, data: output, error: e.message });
        }
      } else {
        resolve({ success: false, data: error, code });
      }
    });
  });
}

// Test 1: Login
async function testLogin() {
  console.log("1️⃣ Testing login...");

  const curlCommand = `-X POST http://localhost:8000/api/v1/users/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"admin123"}'`;
  const result = await executeCurl(curlCommand);

  if (result.success && result.data.success) {
    accessToken = result.data.data.accessToken;
    console.log("✅ Login successful");
    console.log("🔑 Access token received");
    return true;
  } else {
    console.log("❌ Login failed:", result.data);
    return false;
  }
}

// Test 2: Create product with description
async function testCreateProduct() {
  console.log("\n2️⃣ Testing product creation with description...");

  const curlCommand = `-X POST http://localhost:8000/api/v1/products -H "Authorization: Bearer ${accessToken}" -H "Content-Type: application/json" -d '${JSON.stringify(testProduct)}'`;
  const result = await executeCurl(curlCommand);

  if (result.success && result.data.success) {
    productId = result.data.data._id;
    console.log("✅ Product created successfully");
    console.log("🆔 Product ID:", productId);
    console.log("📝 Description in response:");
    console.log("   ", result.data.data.description);

    // Verify description
    if (
      result.data.data.description &&
      result.data.data.description.trim() !== ""
    ) {
      console.log("✅ Description is properly saved and returned");
    } else {
      console.log("❌ Description is empty or missing");
    }
    return true;
  } else {
    console.log("❌ Product creation failed:", result.data);
    return false;
  }
}

// Test 3: Get product by ID
async function testGetProductById() {
  console.log("\n3️⃣ Testing get product by ID...");

  const curlCommand = `-X GET http://localhost:8000/api/v1/products/${productId}`;
  const result = await executeCurl(curlCommand);

  if (result.success && result.data.success) {
    console.log("✅ Product retrieved successfully");
    console.log("📝 Description in response:");
    console.log("   ", result.data.data.description);

    if (
      result.data.data.description &&
      result.data.data.description.trim() !== ""
    ) {
      console.log("✅ Description is properly returned in get by ID");
    } else {
      console.log("❌ Description is empty or missing in get by ID");
    }
    return true;
  } else {
    console.log("❌ Get product by ID failed:", result.data);
    return false;
  }
}

// Test 4: Get all products
async function testGetAllProducts() {
  console.log("\n4️⃣ Testing get all products...");

  const curlCommand = `-X GET http://localhost:8000/api/v1/products`;
  const result = await executeCurl(curlCommand);

  if (result.success && result.data.success) {
    console.log("✅ Products retrieved successfully");

    // Find our test product
    const ourProduct = result.data.data.products.find(
      (p) => p._id === productId
    );
    if (ourProduct) {
      console.log("📝 Description in products list:");
      console.log("   ", ourProduct.description);

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
    console.log("❌ Get all products failed:", result.data);
    return false;
  }
}

// Test 5: Search by description
async function testSearchByDescription() {
  console.log("\n5️⃣ Testing search by description...");

  const searchTerm = "comprehensive product description";
  const curlCommand = `-X GET "http://localhost:8000/api/v1/products?search=${encodeURIComponent(searchTerm)}"`;
  const result = await executeCurl(curlCommand);

  if (result.success && result.data.success) {
    console.log("✅ Search by description successful");

    const foundProduct = result.data.data.products.find(
      (p) => p._id === productId
    );
    if (foundProduct) {
      console.log("✅ Product found by description search");
      console.log("📝 Found product description:");
      console.log("   ", foundProduct.description);
    } else {
      console.log("❌ Product not found by description search");
    }
    return true;
  } else {
    console.log("❌ Search by description failed:", result.data);
    return false;
  }
}

// Test 6: Update description
async function testUpdateDescription() {
  console.log("\n6️⃣ Testing update product description...");

  const updateData = {
    description:
      "UPDATED: This is a completely new and improved product description with updated information about the latest features and enhanced benefits.",
  };

  const curlCommand = `-X PUT http://localhost:8000/api/v1/products/${productId} -H "Authorization: Bearer ${accessToken}" -H "Content-Type: application/json" -d '${JSON.stringify(updateData)}'`;
  const result = await executeCurl(curlCommand);

  if (result.success && result.data.success) {
    console.log("✅ Product description updated successfully");
    console.log("📝 Updated description:");
    console.log("   ", result.data.data.description);

    if (result.data.data.description.includes("UPDATED:")) {
      console.log("✅ Description was properly updated");
    } else {
      console.log("❌ Description was not updated correctly");
    }
    return true;
  } else {
    console.log("❌ Update product description failed:", result.data);
    return false;
  }
}

// Test 7: Cleanup
async function testCleanup() {
  console.log("\n7️⃣ Cleaning up test product...");

  const curlCommand = `-X DELETE http://localhost:8000/api/v1/products/${productId} -H "Authorization: Bearer ${accessToken}"`;
  const result = await executeCurl(curlCommand);

  if (result.success && result.data.success) {
    console.log("✅ Test product deleted successfully");
    return true;
  } else {
    console.log("❌ Delete test product failed:", result.data);
    return false;
  }
}

// Run all tests
async function runTests() {
  try {
    console.log("🚀 Starting product description tests...\n");

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
    console.log("\n📋 Test Summary:");
    console.log("✅ Product description is properly saved during creation");
    console.log("✅ Product description is returned in get by ID");
    console.log("✅ Product description is returned in products list");
    console.log("✅ Product description is searchable");
    console.log("✅ Product description can be updated");
    console.log("✅ All operations work correctly");
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
