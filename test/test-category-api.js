import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const testCategoryAPI = async () => {
  console.log("🧪 Testing Category API Endpoints\n");

  const baseUrl = "http://localhost:8000/api/v1/categories";

  // Test 1: Get all categories
  console.log("1. Testing get all categories...");
  try {
    const response = await fetch(`${baseUrl}`, {
      method: "GET",
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ PASS: Categories retrieved successfully");
      console.log(`   Total Categories: ${data.data.length}`);
      data.data.forEach((cat, index) => {
        console.log(
          `   ${index + 1}. ${cat.name} (${cat.slug}) - Image: ${cat.image || "None"}`
        );
      });
    } else {
      console.log("❌ FAIL: Failed to retrieve categories");
      console.log(`   Error: ${data.message}`);
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }
  console.log("---");

  // Test 2: Create category (without auth - should fail)
  console.log("2. Testing category creation without authentication...");
  try {
    const formData = new FormData();
    formData.append("name", "Test Category");

    const response = await fetch(`${baseUrl}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.status === 401) {
      console.log("✅ PASS: Category creation blocked without authentication");
      console.log(`   Message: ${data.message}`);
    } else {
      console.log("❌ FAIL: Category creation should require authentication");
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }
  console.log("---");

  // Test 3: Create category with invalid token
  console.log("3. Testing category creation with invalid token...");
  try {
    const formData = new FormData();
    formData.append("name", "Test Category");

    const response = await fetch(`${baseUrl}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer invalid_token",
      },
      body: formData,
    });

    const data = await response.json();
    if (response.status === 401) {
      console.log("✅ PASS: Category creation blocked with invalid token");
      console.log(`   Message: ${data.message}`);
    } else {
      console.log(
        "❌ FAIL: Category creation should be blocked with invalid token"
      );
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }
  console.log("---");

  // Test 4: Update category without auth
  console.log("4. Testing category update without authentication...");
  try {
    const formData = new FormData();
    formData.append("name", "Updated Category");

    const response = await fetch(`${baseUrl}/fake_id`, {
      method: "PUT",
      body: formData,
    });

    const data = await response.json();
    if (response.status === 401) {
      console.log("✅ PASS: Category update blocked without authentication");
      console.log(`   Message: ${data.message}`);
    } else {
      console.log("❌ FAIL: Category update should require authentication");
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }
  console.log("---");

  // Test 5: Delete category without auth
  console.log("5. Testing category deletion without authentication...");
  try {
    const response = await fetch(`${baseUrl}/fake_id`, {
      method: "DELETE",
    });

    const data = await response.json();
    if (response.status === 401) {
      console.log("✅ PASS: Category deletion blocked without authentication");
      console.log(`   Message: ${data.message}`);
    } else {
      console.log("❌ FAIL: Category deletion should require authentication");
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }
  console.log("---");

  console.log("🎯 Category API Tests Complete!");
  console.log("\n📝 Note: To test authenticated endpoints, you need to:");
  console.log("   1. Create a super admin user");
  console.log("   2. Login to get an access token");
  console.log("   3. Use the token in Authorization header");
  console.log("   4. Test category creation/update with image uploads");
};

// Run the tests
testCategoryAPI();
