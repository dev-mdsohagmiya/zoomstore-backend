import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const testSuperAdminValidation = async () => {
  console.log("🧪 Testing Super Admin Validation\n");

  const baseUrl = "http://localhost:8000/api/v1";

  // Test 0: Check if server is running
  console.log("0. Checking if server is running...");
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "test",
      }),
    });

    if (response.status === 404 || response.status === 400) {
      console.log("✅ Server is running (got expected error response)");
    } else {
      console.log("✅ Server is running");
    }
  } catch (error) {
    console.log("❌ Server is not running or not accessible");
    console.log("   Please start the server with: npm run dev");
    console.log("   Error:", error.message);
    return;
  }
  console.log("---");

  // Test 1: Try to register with super admin role
  console.log("1. Testing registration with super admin role...");
  try {
    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append("name", "Test Super Admin");
    formData.append("email", "testsuperadmin@example.com");
    formData.append("password", "password123");
    formData.append("role", "superadmin");

    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.status === 403) {
      console.log("✅ PASS: Registration with super admin role blocked");
      console.log(`   Message: ${data.message}`);
    } else {
      console.log(
        "❌ FAIL: Registration with super admin role should be blocked"
      );
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }
  console.log("---");

  // Test 2: Try to create admin with super admin role
  console.log("2. Testing admin creation with super admin role...");
  try {
    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append("name", "Test Super Admin");
    formData.append("email", "testsuperadmin2@example.com");
    formData.append("password", "password123");
    formData.append("role", "superadmin");

    const response = await fetch(`${baseUrl}/admin/create`, {
      method: "POST",
      headers: {
        Authorization: "Bearer fake_token", // This will fail auth, but we're testing validation
      },
      body: formData,
    });

    const data = await response.json();
    if (response.status === 403) {
      console.log("✅ PASS: Admin creation with super admin role blocked");
      console.log(`   Message: ${data.message}`);
    } else {
      console.log(
        "❌ FAIL: Admin creation with super admin role should be blocked"
      );
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }
  console.log("---");

  // Test 3: Try to create super admin with request body data
  console.log("3. Testing super admin setup with request body data...");
  try {
    const response = await fetch(`${baseUrl}/super-admin/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "testsuperadmin3@example.com",
        password: "password123",
        role: "superadmin",
      }),
    });

    const data = await response.json();
    if (response.status === 403) {
      console.log("✅ PASS: Super admin setup with request body data blocked");
      console.log(`   Message: ${data.message}`);
    } else {
      console.log(
        "❌ FAIL: Super admin setup with request body data should be blocked"
      );
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }
  console.log("---");

  // Test 4: Valid super admin setup (if env vars are set)
  console.log("4. Testing valid super admin setup...");
  if (process.env.SUPER_ADMIN_EMAIL && process.env.SUPER_ADMIN_PASSWORD) {
    try {
      const response = await fetch(`${baseUrl}/super-admin/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ PASS: Valid super admin setup successful");
        console.log(`   Message: ${data.message}`);
      } else {
        console.log("❌ FAIL: Valid super admin setup should succeed");
        console.log(`   Error: ${data.message}`);
      }
    } catch (error) {
      console.log("❌ ERROR:", error.message);
    }
  } else {
    console.log("⚠️  SKIP: Super admin environment variables not set");
  }
  console.log("---");

  console.log("🎯 Super Admin Validation Tests Complete!");
};

// Run the tests
testSuperAdminValidation();
