import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const testLogin = async (email, password, expectedRole) => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ Login successful for ${expectedRole}:`);
      console.log(`   Email: ${data.data.user.email}`);
      console.log(`   Role: ${data.data.role}`);
      console.log(`   Message: ${data.message}`);
      console.log(
        `   Access Token: ${data.data.accessToken ? "Present" : "Missing"}`
      );
    } else {
      console.log(`❌ Login failed for ${expectedRole}:`);
      console.log(`   Error: ${data.message}`);
    }
  } catch (error) {
    console.log(`❌ Network error for ${expectedRole}:`, error.message);
  }
  console.log("---");
};

const runTests = async () => {
  console.log("🧪 Testing Login Functionality for Different User Roles\n");

  // Test super admin login (if environment variables are set)
  if (process.env.SUPER_ADMIN_EMAIL && process.env.SUPER_ADMIN_PASSWORD) {
    await testLogin(
      process.env.SUPER_ADMIN_EMAIL,
      process.env.SUPER_ADMIN_PASSWORD,
      "Super Admin"
    );
  } else {
    console.log(
      "⚠️  Super admin credentials not found in environment variables"
    );
    console.log("---");
  }

  // Test with sample credentials (you can modify these)
  await testLogin("admin@example.com", "admin123", "Admin");
  await testLogin("user@example.com", "user123", "Regular User");
  await testLogin("nonexistent@example.com", "password", "Non-existent User");
};

// Run the tests
runTests();
