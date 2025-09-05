// Test script to verify product photo upload functionality
// Run with: node test-product-photo-upload.js

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

async function testProductPhotoUpload() {
  console.log("🧪 Testing Product Photo Upload Functionality\n");

  try {
    // Step 1: Register a test admin user
    console.log("1. Registering test admin user...");
    const registerCommand = `curl -X POST ${BASE_URL}/users/register \\
      -H "Content-Type: application/json" \\
      -d '{"name":"Test Admin","email":"admin@example.com","password":"admin123","role":"admin"}'`;

    const registerResult = await runCommand(registerCommand);
    console.log("Register response:", registerResult.stdout);

    // Extract token from response
    let adminToken = null;
    try {
      const registerData = JSON.parse(registerResult.stdout);
      adminToken = registerData.data?.accessToken;
    } catch (e) {
      console.log("Could not parse register response");
    }

    if (!adminToken) {
      console.log("❌ Could not get admin token");
      return;
    }

    console.log("✅ Admin user registered successfully");

    // Step 2: Create a test category
    console.log("\n2. Creating test category...");
    const categoryCommand = `curl -X POST ${BASE_URL}/categories \\
      -H "Content-Type: application/json" \\
      -H "Authorization: Bearer ${adminToken}" \\
      -d '{"name":"Test Electronics"}'`;

    const categoryResult = await runCommand(categoryCommand);
    console.log("Category response:", categoryResult.stdout);

    // Extract category ID
    let categoryId = null;
    try {
      const categoryData = JSON.parse(categoryResult.stdout);
      categoryId = categoryData.data?._id;
    } catch (e) {
      console.log("Could not parse category response");
    }

    if (!categoryId) {
      console.log("❌ Could not get category ID");
      return;
    }

    console.log("✅ Category created successfully with ID:", categoryId);

    // Step 3: Test product creation with photo upload
    console.log("\n3. Testing product creation with photo upload...");

    // Check if test image exists
    const testImagePath = "./public/temp/photo.jpg";
    if (!fs.existsSync(testImagePath)) {
      console.log("❌ Test image not found at:", testImagePath);
      console.log(
        "Please ensure there's a test image at public/temp/photo.jpg"
      );
      return;
    }

    const productCommand = `curl -X POST ${BASE_URL}/products \\
      -H "Authorization: Bearer ${adminToken}" \\
      -F "name=Test Product with Photos" \\
      -F "description=This is a test product with photo upload functionality" \\
      -F "price=99.99" \\
      -F "discount=10" \\
      -F "stock=50" \\
      -F "categories=[\\"${categoryId}\\"]" \\
      -F "photos=@${testImagePath}"`;

    const productResult = await runCommand(productCommand);
    console.log("Product response:", productResult.stdout);

    // Parse product response
    try {
      const productData = JSON.parse(productResult.stdout);
      if (productData.sucess || productData.success) {
        console.log("✅ Product created successfully!");
        console.log("📋 Product details:");
        console.log("   - Product ID:", productData.data._id);
        console.log("   - Name:", productData.data.name);
        console.log("   - Price:", productData.data.price);
        console.log(
          "   - Photos uploaded:",
          productData.data.photos?.length || 0
        );

        if (productData.data.photos && productData.data.photos.length > 0) {
          console.log("📸 Photo URLs:");
          productData.data.photos.forEach((photo, index) => {
            console.log(`   ${index + 1}. ${photo}`);
          });
        } else {
          console.log(
            "⚠️  No photos found in response - this indicates the bug!"
          );
        }
      } else {
        console.log("❌ Product creation failed:", productData.message);
      }
    } catch (e) {
      console.log("❌ Could not parse product response:", e.message);
    }

    // Step 4: Test with multiple photos
    console.log("\n4. Testing product creation with multiple photos...");

    // Check if we have multiple test images
    const testImages = [
      "./public/temp/photo.jpg",
      "./public/temp/ALL ABOUT VistaTask (1).jpg",
    ];

    const existingImages = testImages.filter((path) => fs.existsSync(path));
    if (existingImages.length === 0) {
      console.log("⚠️  No test images found, skipping multiple photo test");
    } else {
      let multiplePhotoCommand = `curl -X POST ${BASE_URL}/products \\
        -H "Authorization: Bearer ${adminToken}" \\
        -F "name=Test Product with Multiple Photos" \\
        -F "description=This is a test product with multiple photo uploads" \\
        -F "price=199.99" \\
        -F "discount=15" \\
        -F "stock=25" \\
        -F "categories=[\\"${categoryId}\\"]"`;

      // Add each existing image
      existingImages.forEach((imagePath) => {
        multiplePhotoCommand += ` -F "photos=@${imagePath}"`;
      });

      const multiplePhotoResult = await runCommand(multiplePhotoCommand);
      console.log("Multiple photos response:", multiplePhotoResult.stdout);

      try {
        const multiplePhotoData = JSON.parse(multiplePhotoResult.stdout);
        if (multiplePhotoData.sucess || multiplePhotoData.success) {
          console.log("✅ Product with multiple photos created successfully!");
          console.log(
            "   - Photos uploaded:",
            multiplePhotoData.data.photos?.length || 0
          );

          if (
            multiplePhotoData.data.photos &&
            multiplePhotoData.data.photos.length > 0
          ) {
            console.log("📸 Photo URLs:");
            multiplePhotoData.data.photos.forEach((photo, index) => {
              console.log(`   ${index + 1}. ${photo}`);
            });
          }
        }
      } catch (e) {
        console.log("❌ Could not parse multiple photos response:", e.message);
      }
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

// Run the test
testProductPhotoUpload();
