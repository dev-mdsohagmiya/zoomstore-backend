// Test script to verify user role filtering functionality
// Run with: node test-user-role-filtering.js

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

async function testUserRoleFiltering() {
  console.log("🧪 Testing User Role Filtering Functionality\n");

  try {
    // Step 1: Register test users with different roles
    console.log("1. Creating test users with different roles...");

    // Create a regular user
    const userCommand = `curl -X POST ${BASE_URL}/users/auth/register \\
      -H "Content-Type: application/json" \\
      -d '{"name":"Test User","email":"user@example.com","password":"password123","role":"user"}'`;

    const userResult = await runCommand(userCommand);
    console.log("User registration:", userResult.stdout);

    // Create an admin user
    const adminCommand = `curl -X POST ${BASE_URL}/users/auth/register \\
      -H "Content-Type: application/json" \\
      -d '{"name":"Test Admin","email":"admin@example.com","password":"admin123","role":"admin"}'`;

    const adminResult = await runCommand(adminCommand);
    console.log("Admin registration:", adminResult.stdout);

    // Step 2: Get admin token for API calls
    console.log("\n2. Getting admin token...");
    const loginCommand = `curl -X POST ${BASE_URL}/users/auth/login \\
      -H "Content-Type: application/json" \\
      -d '{"email":"admin@example.com","password":"admin123"}'`;

    const loginResult = await runCommand(loginCommand);
    console.log("Login response:", loginResult.stdout);

    let adminToken = null;
    try {
      const loginData = JSON.parse(loginResult.stdout);
      adminToken = loginData.data?.accessToken;
    } catch (e) {
      console.log("Could not parse login response");
    }

    if (!adminToken) {
      console.log("❌ Could not get admin token");
      return;
    }

    console.log("✅ Admin token obtained successfully");

    // Step 3: Test getting all users
    console.log("\n3. Testing get all users...");
    const allUsersCommand = `curl -X GET "${BASE_URL}/users?page=1&limit=10" \\
      -H "Authorization: Bearer ${adminToken}"`;

    const allUsersResult = await runCommand(allUsersCommand);
    console.log("All users response:", allUsersResult.stdout);

    // Step 4: Test filtering by role - users only
    console.log("\n4. Testing filter by role: user...");
    const userRoleCommand = `curl -X GET "${BASE_URL}/users?page=1&limit=10&role=user" \\
      -H "Authorization: Bearer ${adminToken}"`;

    const userRoleResult = await runCommand(userRoleCommand);
    console.log("Users with role 'user':", userRoleResult.stdout);

    // Step 5: Test filtering by role - admins only
    console.log("\n5. Testing filter by role: admin...");
    const adminRoleCommand = `curl -X GET "${BASE_URL}/users?page=1&limit=10&role=admin" \\
      -H "Authorization: Bearer ${adminToken}"`;

    const adminRoleResult = await runCommand(adminRoleCommand);
    console.log("Users with role 'admin':", adminRoleResult.stdout);

    // Step 6: Test search functionality
    console.log("\n6. Testing search functionality...");
    const searchCommand = `curl -X GET "${BASE_URL}/users?page=1&limit=10&search=Test" \\
      -H "Authorization: Bearer ${adminToken}"`;

    const searchResult = await runCommand(searchCommand);
    console.log("Search for 'Test':", searchResult.stdout);

    // Step 7: Test combined filters
    console.log("\n7. Testing combined filters (role + search)...");
    const combinedCommand = `curl -X GET "${BASE_URL}/users?page=1&limit=10&role=user&search=Test" \\
      -H "Authorization: Bearer ${adminToken}"`;

    const combinedResult = await runCommand(combinedCommand);
    console.log(
      "Combined filters (role=user, search=Test):",
      combinedResult.stdout
    );

    // Step 8: Test invalid role
    console.log("\n8. Testing invalid role...");
    const invalidRoleCommand = `curl -X GET "${BASE_URL}/users?page=1&limit=10&role=invalid" \\
      -H "Authorization: Bearer ${adminToken}"`;

    const invalidRoleResult = await runCommand(invalidRoleCommand);
    console.log("Invalid role response:", invalidRoleResult.stdout);

    // Parse and display results
    console.log("\n📊 Test Results Summary:");
    console.log("========================");

    // Parse all users response
    try {
      const allUsersData = JSON.parse(allUsersResult.stdout);
      if (allUsersData.success) {
        console.log(
          `✅ All users: ${allUsersData.data.users.length} users found`
        );
        console.log(`   Total users: ${allUsersData.data.pagination.total}`);
      }
    } catch (e) {
      console.log("❌ Could not parse all users response");
    }

    // Parse user role filter response
    try {
      const userRoleData = JSON.parse(userRoleResult.stdout);
      if (userRoleData.success) {
        console.log(
          `✅ User role filter: ${userRoleData.data.users.length} users found`
        );
        console.log(`   Applied filters:`, userRoleData.data.filters);
      }
    } catch (e) {
      console.log("❌ Could not parse user role filter response");
    }

    // Parse admin role filter response
    try {
      const adminRoleData = JSON.parse(adminRoleResult.stdout);
      if (adminRoleData.success) {
        console.log(
          `✅ Admin role filter: ${adminRoleData.data.users.length} users found`
        );
        console.log(`   Applied filters:`, adminRoleData.data.filters);
      }
    } catch (e) {
      console.log("❌ Could not parse admin role filter response");
    }

    // Parse search response
    try {
      const searchData = JSON.parse(searchResult.stdout);
      if (searchData.success) {
        console.log(
          `✅ Search filter: ${searchData.data.users.length} users found`
        );
        console.log(`   Applied filters:`, searchData.data.filters);
      }
    } catch (e) {
      console.log("❌ Could not parse search response");
    }

    // Parse invalid role response
    try {
      const invalidRoleData = JSON.parse(invalidRoleResult.stdout);
      if (!invalidRoleData.success) {
        console.log(`✅ Invalid role handling: ${invalidRoleData.message}`);
      }
    } catch (e) {
      console.log("❌ Could not parse invalid role response");
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

// Run the test
testUserRoleFiltering();
