// Test script to verify order photo upload functionality
// Run with: node test-order-photo-upload.js

const BASE_URL = "http://localhost:8000/api/v1";
const FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");

// Test data
const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

const testProduct = {
  name: "Test Product",
  description: "This is a test product for order photo upload",
  price: 99.99,
  discount: 10,
  stock: 50,
  category: "Electronics",
};

// Helper function to make API calls
async function apiCall(
  endpoint,
  method = "GET",
  data = null,
  token = null,
  isFormData = false
) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {},
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (data && !isFormData) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  } else if (data && isFormData) {
    options.body = data;
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    return { status: response.status, data: responseData };
  } catch (error) {
    console.error(`Error making API call to ${endpoint}:`, error.message);
    return { status: 500, data: { error: error.message } };
  }
}

async function testOrderPhotoUpload() {
  console.log("🧪 Testing Order Photo Upload Functionality\n");

  try {
    // Step 1: Register a test user
    console.log("1. Registering test user...");
    const registerResponse = await apiCall("/users/register", "POST", testUser);

    if (registerResponse.status !== 201) {
      console.log("❌ User registration failed:", registerResponse.data);
      return;
    }

    const userToken = registerResponse.data.data.accessToken;
    console.log("✅ User registered successfully");

    // Step 2: Create a test product
    console.log("\n2. Creating test product...");
    const productResponse = await apiCall(
      "/products",
      "POST",
      testProduct,
      userToken
    );

    if (productResponse.status !== 201) {
      console.log("❌ Product creation failed:", productResponse.data);
      return;
    }

    const productId = productResponse.data.data._id;
    console.log("✅ Product created successfully with ID:", productId);

    // Step 3: Test order creation with photo upload
    console.log("\n3. Testing order creation with photo upload...");

    // Create form data for multipart/form-data request
    const formData = new FormData();

    // Add order data
    formData.append(
      "items",
      JSON.stringify([
        {
          product: productId,
          qty: 2,
        },
      ])
    );
    formData.append(
      "shippingAddress",
      JSON.stringify({
        address: "123 Test Street",
        city: "Test City",
        postalCode: "12345",
        country: "Test Country",
      })
    );
    formData.append("paymentMethod", "credit_card");

    // Add test photo (using an existing image from public/temp)
    const testImagePath = "./public/temp/photo.jpg";
    if (fs.existsSync(testImagePath)) {
      formData.append("photos", fs.createReadStream(testImagePath));
      console.log("📸 Added test photo to form data");
    } else {
      console.log("⚠️  Test photo not found, testing without photo");
    }

    const orderResponse = await apiCall(
      "/orders",
      "POST",
      formData,
      userToken,
      true
    );

    if (orderResponse.status === 201) {
      console.log("✅ Order created successfully!");
      console.log("📋 Order details:");
      console.log("   - Order ID:", orderResponse.data.data._id);
      console.log("   - Total Price:", orderResponse.data.data.totalPrice);
      console.log(
        "   - Photos uploaded:",
        orderResponse.data.data.photos?.length || 0
      );

      if (
        orderResponse.data.data.photos &&
        orderResponse.data.data.photos.length > 0
      ) {
        console.log("📸 Photo URLs:");
        orderResponse.data.data.photos.forEach((photo, index) => {
          console.log(`   ${index + 1}. ${photo.url}`);
        });
      } else {
        console.log("⚠️  No photos found in response");
      }
    } else {
      console.log("❌ Order creation failed:", orderResponse.data);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

// Run the test
testOrderPhotoUpload();
