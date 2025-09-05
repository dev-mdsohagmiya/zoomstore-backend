// Simple test script to verify order photo upload functionality
// This test uses curl commands to test the API

const { exec } = require("child_process");
const fs = require("fs");

const BASE_URL = "http://localhost:8000/api/v1";

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function testOrderPhotoUpload() {
  console.log("🧪 Testing Order Photo Upload Functionality\n");

  try {
    // Step 1: Register a test user
    console.log("1. Registering test user...");
    const registerCommand = `curl -X POST ${BASE_URL}/users/register \\
      -H "Content-Type: application/json" \\
      -d '{"name":"Test User","email":"test@example.com","password":"password123"}'`;

    const registerResult = await runCommand(registerCommand);
    console.log("Register response:", registerResult.stdout);

    // Extract token from response (this is a simplified approach)
    let userToken = null;
    try {
      const registerData = JSON.parse(registerResult.stdout);
      userToken = registerData.data?.accessToken;
    } catch (e) {
      console.log("Could not parse register response");
    }

    if (!userToken) {
      console.log("❌ Could not get user token");
      return;
    }

    console.log("✅ User registered successfully");

    // Step 2: Create a test product
    console.log("\n2. Creating test product...");
    const productCommand = `curl -X POST ${BASE_URL}/products \\
      -H "Content-Type: application/json" \\
      -H "Authorization: Bearer ${userToken}" \\
      -d '{"name":"Test Product","description":"Test product for photo upload","price":99.99,"discount":10,"stock":50,"category":"Electronics"}'`;

    const productResult = await runCommand(productCommand);
    console.log("Product response:", productResult.stdout);

    // Extract product ID
    let productId = null;
    try {
      const productData = JSON.parse(productResult.stdout);
      productId = productData.data?._id;
    } catch (e) {
      console.log("Could not parse product response");
    }

    if (!productId) {
      console.log("❌ Could not get product ID");
      return;
    }

    console.log("✅ Product created successfully with ID:", productId);

    // Step 3: Test order creation with photo upload
    console.log("\n3. Testing order creation with photo upload...");

    // Check if test image exists
    const testImagePath = "./public/temp/photo.jpg";
    if (!fs.existsSync(testImagePath)) {
      console.log("❌ Test image not found at:", testImagePath);
      console.log(
        "Please ensure there's a test image at public/temp/photo.jpg"
      );
      return;
    }

    const orderCommand = `curl -X POST ${BASE_URL}/orders \\
      -H "Authorization: Bearer ${userToken}" \\
      -F "items=[{\\"product\\":\\"${productId}\\",\\"qty\\":2}]" \\
      -F "shippingAddress={\\"address\\":\\"123 Test Street\\",\\"city\\":\\"Test City\\",\\"postalCode\\":\\"12345\\",\\"country\\":\\"Test Country\\"}" \\
      -F "paymentMethod=credit_card" \\
      -F "photos=@${testImagePath}"`;

    const orderResult = await runCommand(orderCommand);
    console.log("Order response:", orderResult.stdout);

    // Parse order response
    try {
      const orderData = JSON.parse(orderResult.stdout);
      if (orderData.success) {
        console.log("✅ Order created successfully!");
        console.log("📋 Order details:");
        console.log("   - Order ID:", orderData.data._id);
        console.log("   - Total Price:", orderData.data.totalPrice);
        console.log(
          "   - Photos uploaded:",
          orderData.data.photos?.length || 0
        );

        if (orderData.data.photos && orderData.data.photos.length > 0) {
          console.log("📸 Photo URLs:");
          orderData.data.photos.forEach((photo, index) => {
            console.log(`   ${index + 1}. ${photo.url}`);
          });
        } else {
          console.log("⚠️  No photos found in response");
        }
      } else {
        console.log("❌ Order creation failed:", orderData.message);
      }
    } catch (e) {
      console.log("❌ Could not parse order response:", e.message);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

// Run the test
testOrderPhotoUpload();
