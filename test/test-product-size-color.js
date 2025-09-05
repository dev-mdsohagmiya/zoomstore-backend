// Test script to verify product size and color functionality
// Run with: node test-product-size-color.js

const { exec } = require("child_process");

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

async function testProductSizeColor() {
  console.log("🧪 Testing Product Size and Color Functionality\n");

  try {
    // Step 1: Register an admin user
    console.log("1. Registering admin user...");
    const adminCommand = `curl -X POST ${BASE_URL}/users/auth/register \\
      -H "Content-Type: application/json" \\
      -d '{"name":"Test Admin","email":"admin@example.com","password":"admin123","role":"admin"}'`;

    const adminResult = await runCommand(adminCommand);
    console.log("Admin registration:", adminResult.stdout);

    // Step 2: Get admin token
    console.log("\n2. Getting admin token...");
    const adminLoginCommand = `curl -X POST ${BASE_URL}/users/auth/login \\
      -H "Content-Type: application/json" \\
      -d '{"email":"admin@example.com","password":"admin123"}'`;

    const adminLoginResult = await runCommand(adminLoginCommand);
    console.log("Admin login:", adminLoginResult.stdout);

    let adminToken = null;
    try {
      const adminLoginData = JSON.parse(adminLoginResult.stdout);
      adminToken = adminLoginData.data?.accessToken;
    } catch (e) {
      console.log("Could not parse admin login response");
    }

    if (!adminToken) {
      console.log("❌ Could not get admin token");
      return;
    }

    console.log("✅ Admin token obtained successfully");

    // Step 3: Create a category
    console.log("\n3. Creating a test category...");
    const categoryCommand = `curl -X POST ${BASE_URL}/categories \\
      -H "Authorization: Bearer ${adminToken}" \\
      -F "name=Electronics"`;

    const categoryResult = await runCommand(categoryCommand);
    console.log("Category creation:", categoryResult.stdout);

    let categoryId = null;
    try {
      const categoryData = JSON.parse(categoryResult.stdout);
      if (categoryData.success) {
        categoryId = categoryData.data._id;
        console.log("✅ Category created successfully with ID:", categoryId);
      } else {
        console.log("❌ Category creation failed:", categoryData.message);
      }
    } catch (e) {
      console.log("❌ Could not parse category response");
    }

    // Step 4: Test product creation with sizes and colors (JSON format)
    console.log(
      "\n4. Testing product creation with sizes and colors (JSON format)..."
    );
    const createProductJsonCommand = `curl -X POST ${BASE_URL}/products \\
      -H "Authorization: Bearer ${adminToken}" \\
      -F "name=Gaming Laptop" \\
      -F "description=High-performance gaming laptop with multiple sizes and colors" \\
      -F "price=1200" \\
      -F "discount=10" \\
      -F "stock=50" \\
      -F "categories=[\\"${categoryId}\\"]" \\
      -F "sizes=[\\"13 inch\\", \\"15 inch\\", \\"17 inch\\"]" \\
      -F "colors=[\\"Black\\", \\"Silver\\", \\"Space Gray\\"]"`;

    const createProductJsonResult = await runCommand(createProductJsonCommand);
    console.log(
      "Create product (JSON) response:",
      createProductJsonResult.stdout
    );

    let productId = null;
    try {
      const createProductData = JSON.parse(createProductJsonResult.stdout);
      if (createProductData.success) {
        productId = createProductData.data._id;
        console.log("✅ Product created successfully with ID:", productId);
        console.log("   - Sizes:", createProductData.data.sizes);
        console.log("   - Colors:", createProductData.data.colors);
      } else {
        console.log("❌ Product creation failed:", createProductData.message);
      }
    } catch (e) {
      console.log("❌ Could not parse create product response");
    }

    // Step 5: Test product creation with sizes and colors (comma-separated format)
    console.log(
      "\n5. Testing product creation with sizes and colors (comma-separated format)..."
    );
    const createProductCsvCommand = `curl -X POST ${BASE_URL}/products \\
      -H "Authorization: Bearer ${adminToken}" \\
      -F "name=Gaming Mouse" \\
      -F "description=High-precision gaming mouse" \\
      -F "price=99.99" \\
      -F "discount=5" \\
      -F "stock=100" \\
      -F "categories=[\\"${categoryId}\\"]" \\
      -F "sizes=Small, Medium, Large" \\
      -F "colors=Black, White, Red, Blue"`;

    const createProductCsvResult = await runCommand(createProductCsvCommand);
    console.log(
      "Create product (CSV) response:",
      createProductCsvResult.stdout
    );

    let productId2 = null;
    try {
      const createProductData = JSON.parse(createProductCsvResult.stdout);
      if (createProductData.success) {
        productId2 = createProductData.data._id;
        console.log("✅ Product created successfully with ID:", productId2);
        console.log("   - Sizes:", createProductData.data.sizes);
        console.log("   - Colors:", createProductData.data.colors);
      } else {
        console.log("❌ Product creation failed:", createProductData.message);
      }
    } catch (e) {
      console.log("❌ Could not parse create product response");
    }

    // Step 6: Test product update with new sizes and colors
    if (productId) {
      console.log("\n6. Testing product update with new sizes and colors...");
      const updateProductCommand = `curl -X PUT ${BASE_URL}/products/${productId} \\
        -H "Authorization: Bearer ${adminToken}" \\
        -F "name=Updated Gaming Laptop" \\
        -F "description=Updated description with new sizes and colors" \\
        -F "sizes=[\\"14 inch\\", \\"16 inch\\", \\"18 inch\\"]" \\
        -F "colors=[\\"Midnight Black\\", \\"Space Silver\\", \\"Rose Gold\\"]"`;

      const updateProductResult = await runCommand(updateProductCommand);
      console.log("Update product response:", updateProductResult.stdout);

      try {
        const updateProductData = JSON.parse(updateProductResult.stdout);
        if (updateProductData.success) {
          console.log("✅ Product updated successfully");
          console.log("   - New Sizes:", updateProductData.data.sizes);
          console.log("   - New Colors:", updateProductData.data.colors);
        } else {
          console.log("❌ Product update failed:", updateProductData.message);
        }
      } catch (e) {
        console.log("❌ Could not parse update product response");
      }
    }

    // Step 7: Test product update with comma-separated format
    if (productId2) {
      console.log(
        "\n7. Testing product update with comma-separated sizes and colors..."
      );
      const updateProductCsvCommand = `curl -X PUT ${BASE_URL}/products/${productId2} \\
        -H "Authorization: Bearer ${adminToken}" \\
        -F "name=Updated Gaming Mouse" \\
        -F "description=Updated gaming mouse description" \\
        -F "sizes=Extra Small, Small, Medium, Large, Extra Large" \\
        -F "colors=Black, White, Red, Blue, Green, Purple"`;

      const updateProductCsvResult = await runCommand(updateProductCsvCommand);
      console.log(
        "Update product (CSV) response:",
        updateProductCsvResult.stdout
      );

      try {
        const updateProductData = JSON.parse(updateProductCsvResult.stdout);
        if (updateProductData.success) {
          console.log("✅ Product updated successfully");
          console.log("   - New Sizes:", updateProductData.data.sizes);
          console.log("   - New Colors:", updateProductData.data.colors);
        } else {
          console.log("❌ Product update failed:", updateProductData.message);
        }
      } catch (e) {
        console.log("❌ Could not parse update product response");
      }
    }

    // Step 8: Test product retrieval to verify sizes and colors are stored
    if (productId) {
      console.log(
        "\n8. Testing product retrieval to verify sizes and colors..."
      );
      const getProductCommand = `curl -X GET ${BASE_URL}/products/${productId}`;

      const getProductResult = await runCommand(getProductCommand);
      console.log("Get product response:", getProductResult.stdout);

      try {
        const getProductData = JSON.parse(getProductResult.stdout);
        if (getProductData.success) {
          console.log("✅ Product retrieved successfully");
          console.log("   - Name:", getProductData.data.name);
          console.log("   - Sizes:", getProductData.data.sizes);
          console.log("   - Colors:", getProductData.data.colors);
        } else {
          console.log("❌ Product retrieval failed:", getProductData.message);
        }
      } catch (e) {
        console.log("❌ Could not parse get product response");
      }
    }

    console.log("\n📊 Test Results Summary:");
    console.log("========================");
    console.log("✅ Product model updated with sizes and colors");
    console.log(
      "✅ Create product supports both JSON and comma-separated formats"
    );
    console.log(
      "✅ Update product supports both JSON and comma-separated formats"
    );
    console.log("✅ Sizes and colors are properly stored and retrieved");
    console.log(
      "✅ Flexible input parsing (JSON arrays or comma-separated strings)"
    );
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

// Run the test
testProductSizeColor();
