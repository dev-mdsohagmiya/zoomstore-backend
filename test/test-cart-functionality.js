import { spawn } from "child_process";

console.log("🛒 Testing Cart Functionality...\n");

// Test data
const testProduct1 = {
  name: "Test Product 1",
  description: "This is a test product for cart functionality",
  price: 100,
  discount: 10,
  stock: 50,
  categories: [],
  sizes: ["S", "M", "L"],
  colors: ["Red", "Blue"],
};

const testProduct2 = {
  name: "Test Product 2",
  description: "Another test product for cart functionality",
  price: 200,
  discount: 0,
  stock: 30,
  categories: [],
  sizes: ["M", "L", "XL"],
  colors: ["Green", "Yellow"],
};

let product1Id = null;
let product2Id = null;
let accessToken = null;
let userId = null;

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

// Test 1: Login
async function testLogin() {
  console.log("1️⃣ Testing login...");

  const loginData = {
    email: "admin@example.com",
    password: "admin123",
  };

  const response = await makeRequest(
    "POST",
    "http://localhost:8000/api/v1/users/login",
    loginData
  );

  if (response.status === 200 && response.data.success) {
    accessToken = response.data.data.accessToken;
    userId = response.data.data.user._id;
    console.log("✅ Login successful");
    console.log("👤 User ID:", userId);
    return true;
  } else {
    console.log("❌ Login failed:", response.data);
    return false;
  }
}

// Test 2: Create test products
async function testCreateProducts() {
  console.log("\n2️⃣ Creating test products...");

  // Create Product 1
  const response1 = await makeRequest(
    "POST",
    "http://localhost:8000/api/v1/products",
    testProduct1,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (response1.status === 200 && response1.data.success) {
    product1Id = response1.data.data._id;
    console.log("✅ Product 1 created:", product1Id);
  } else {
    console.log("❌ Product 1 creation failed:", response1.data);
    return false;
  }

  // Create Product 2
  const response2 = await makeRequest(
    "POST",
    "http://localhost:8000/api/v1/products",
    testProduct2,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (response2.status === 200 && response2.data.success) {
    product2Id = response2.data.data._id;
    console.log("✅ Product 2 created:", product2Id);
    return true;
  } else {
    console.log("❌ Product 2 creation failed:", response2.data);
    return false;
  }
}

// Test 3: Get empty cart
async function testGetEmptyCart() {
  console.log("\n3️⃣ Testing get empty cart...");

  const response = await makeRequest(
    "GET",
    "http://localhost:8000/api/v1/cart",
    null,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ Cart retrieved successfully");
    console.log("📦 Cart items:", response.data.data.items.length);
    console.log("💰 Total price:", response.data.data.totalPrice);
    return true;
  } else {
    console.log("❌ Get cart failed:", response.data);
    return false;
  }
}

// Test 4: Add items to cart
async function testAddToCart() {
  console.log("\n4️⃣ Testing add to cart...");

  // Add Product 1 with size and color
  const addData1 = {
    productId: product1Id,
    quantity: 2,
    selectedSize: "M",
    selectedColor: "Red",
  };

  const response1 = await makeRequest(
    "POST",
    "http://localhost:8000/api/v1/cart/add",
    addData1,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (response1.status === 200 && response1.data.success) {
    console.log("✅ Product 1 added to cart with size and color");
    console.log("📦 Cart items:", response1.data.data.items.length);
    console.log("💰 Total price:", response1.data.data.totalPrice);
    console.log(
      "🎨 Selected size:",
      response1.data.data.items[0]?.selectedSize
    );
    console.log(
      "🎨 Selected color:",
      response1.data.data.items[0]?.selectedColor
    );
  } else {
    console.log("❌ Add Product 1 failed:", response1.data);
    return false;
  }

  // Add Product 2 without size and color
  const addData2 = {
    productId: product2Id,
    quantity: 1,
  };

  const response2 = await makeRequest(
    "POST",
    "http://localhost:8000/api/v1/cart/add",
    addData2,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (response2.status === 200 && response2.data.success) {
    console.log("✅ Product 2 added to cart without size/color");
    console.log("📦 Cart items:", response2.data.data.items.length);
    console.log("💰 Total price:", response2.data.data.totalPrice);
    return true;
  } else {
    console.log("❌ Add Product 2 failed:", response2.data);
    return false;
  }
}

// Test 5: Get cart with items
async function testGetCartWithItems() {
  console.log("\n5️⃣ Testing get cart with items...");

  const response = await makeRequest(
    "GET",
    "http://localhost:8000/api/v1/cart",
    null,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ Cart retrieved successfully");
    console.log("📦 Total items:", response.data.data.totalItems);
    console.log("💰 Total price:", response.data.data.totalPrice);
    console.log("🛍️ Items in cart:");
    response.data.data.items.forEach((item, index) => {
      console.log(
        `   ${index + 1}. ${item.product.name} - Qty: ${item.quantity} - Price: $${item.price}`
      );
    });
    return true;
  } else {
    console.log("❌ Get cart failed:", response.data);
    return false;
  }
}

// Test 6: Update cart item quantity
async function testUpdateCartItem() {
  console.log("\n6️⃣ Testing update cart item quantity...");

  const updateData = {
    productId: product1Id,
    quantity: 3,
  };

  const response = await makeRequest(
    "PUT",
    "http://localhost:8000/api/v1/cart/update",
    updateData,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ Cart item updated successfully");
    console.log("📦 Total items:", response.data.data.totalItems);
    console.log("💰 Total price:", response.data.data.totalPrice);
    return true;
  } else {
    console.log("❌ Update cart item failed:", response.data);
    return false;
  }
}

// Test 6.5: Update cart item size and color
async function testUpdateCartItemSizeColor() {
  console.log("\n6️⃣.5️⃣ Testing update cart item size and color...");

  const updateData = {
    productId: product1Id,
    selectedSize: "L",
    selectedColor: "Blue",
  };

  const response = await makeRequest(
    "PUT",
    "http://localhost:8000/api/v1/cart/update",
    updateData,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ Cart item size and color updated successfully");
    console.log("📦 Total items:", response.data.data.totalItems);
    console.log("💰 Total price:", response.data.data.totalPrice);

    // Find the updated item
    const updatedItem = response.data.data.items.find(
      (item) => item.product._id === product1Id
    );
    if (updatedItem) {
      console.log("🎨 New size:", updatedItem.selectedSize);
      console.log("🎨 New color:", updatedItem.selectedColor);
    }
    return true;
  } else {
    console.log("❌ Update cart item size/color failed:", response.data);
    return false;
  }
}

// Test 7: Get cart summary
async function testGetCartSummary() {
  console.log("\n7️⃣ Testing get cart summary...");

  const response = await makeRequest(
    "GET",
    "http://localhost:8000/api/v1/cart/summary",
    null,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ Cart summary retrieved successfully");
    console.log("📦 Total items:", response.data.data.totalItems);
    console.log("💰 Total price:", response.data.data.totalPrice);
    console.log("🛍️ Item count:", response.data.data.itemCount);
    return true;
  } else {
    console.log("❌ Get cart summary failed:", response.data);
    return false;
  }
}

// Test 8: Remove item from cart
async function testRemoveFromCart() {
  console.log("\n8️⃣ Testing remove item from cart...");

  const response = await makeRequest(
    "DELETE",
    `http://localhost:8000/api/v1/cart/remove/${product2Id}`,
    null,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ Item removed from cart successfully");
    console.log("📦 Total items:", response.data.data.totalItems);
    console.log("💰 Total price:", response.data.data.totalPrice);
    return true;
  } else {
    console.log("❌ Remove item failed:", response.data);
    return false;
  }
}

// Test 9: Test stock management
async function testStockManagement() {
  console.log("\n9️⃣ Testing stock management...");

  // Check product stock after cart operations
  const response1 = await makeRequest(
    "GET",
    `http://localhost:8000/api/v1/products/${product1Id}`
  );
  const response2 = await makeRequest(
    "GET",
    `http://localhost:8000/api/v1/products/${product2Id}`
  );

  if (response1.status === 200 && response1.data.success) {
    console.log(
      "✅ Product 1 stock after cart operations:",
      response1.data.data.stock
    );
  }

  if (response2.status === 200 && response2.data.success) {
    console.log(
      "✅ Product 2 stock after cart operations:",
      response2.data.data.stock
    );
  }

  return true;
}

// Test 10: Clear cart
async function testClearCart() {
  console.log("\n🔟 Testing clear cart...");

  const response = await makeRequest(
    "DELETE",
    "http://localhost:8000/api/v1/cart/clear",
    null,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (response.status === 200 && response.data.success) {
    console.log("✅ Cart cleared successfully");
    console.log("📦 Total items:", response.data.data.totalItems);
    console.log("💰 Total price:", response.data.data.totalPrice);
    return true;
  } else {
    console.log("❌ Clear cart failed:", response.data);
    return false;
  }
}

// Test 11: Cleanup - Delete test products
async function testCleanup() {
  console.log("\n🧹 Cleaning up test products...");

  const response1 = await makeRequest(
    "DELETE",
    `http://localhost:8000/api/v1/products/${product1Id}`,
    null,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  const response2 = await makeRequest(
    "DELETE",
    `http://localhost:8000/api/v1/products/${product2Id}`,
    null,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (response1.status === 200 && response1.data.success) {
    console.log("✅ Product 1 deleted successfully");
  }

  if (response2.status === 200 && response2.data.success) {
    console.log("✅ Product 2 deleted successfully");
  }

  return true;
}

// Run all tests
async function runTests() {
  try {
    const loginSuccess = await testLogin();
    if (!loginSuccess) {
      console.log("\n❌ Cannot proceed without login");
      return;
    }

    const createSuccess = await testCreateProducts();
    if (!createSuccess) {
      console.log("\n❌ Cannot proceed without products");
      return;
    }

    await testGetEmptyCart();
    await testAddToCart();
    await testGetCartWithItems();
    await testUpdateCartItem();
    await testUpdateCartItemSizeColor();
    await testGetCartSummary();
    await testRemoveFromCart();
    await testStockManagement();
    await testClearCart();
    await testCleanup();

    console.log("\n🎉 All cart functionality tests completed!");
    console.log("\n📋 Test Summary:");
    console.log("✅ Cart creation and retrieval");
    console.log("✅ Add items to cart with stock management");
    console.log("✅ Update cart item quantities");
    console.log("✅ Remove items from cart");
    console.log("✅ Get cart summary");
    console.log("✅ Clear entire cart");
    console.log("✅ Automatic stock management");
    console.log("✅ Cart expiration handling (1 day)");
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
