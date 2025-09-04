import dotenv from "dotenv";
import { User } from "../src/models/user.model.js";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const testValidationDirect = async () => {
  console.log("🧪 Testing Super Admin Validation Directly\n");

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Test 1: Try to create user with super admin role directly
    console.log("1. Testing direct user creation with super admin role...");
    try {
      const user = new User({
        name: "Test Super Admin",
        email: "testsuperadmin@example.com",
        password: "password123",
        role: "superadmin",
      });

      await user.save();
      console.log("❌ FAIL: Should not be able to create super admin directly");
    } catch (error) {
      if (
        error.message.includes(
          "Super admin role can only be assigned through environment variables"
        )
      ) {
        console.log(
          "✅ PASS: Direct super admin creation blocked by model validation"
        );
        console.log(`   Message: ${error.message}`);
      } else {
        console.log("❌ FAIL: Unexpected error:", error.message);
      }
    }
    console.log("---");

    // Test 2: Try to create user with super admin role from environment variables
    console.log(
      "2. Testing super admin creation from environment variables..."
    );
    if (process.env.SUPER_ADMIN_EMAIL && process.env.SUPER_ADMIN_PASSWORD) {
      try {
        const user = new User({
          name: "Super Admin",
          email: process.env.SUPER_ADMIN_EMAIL,
          password: process.env.SUPER_ADMIN_PASSWORD,
          role: "superadmin",
        });

        await user.save();
        console.log(
          "✅ PASS: Super admin creation from environment variables allowed"
        );
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
      } catch (error) {
        console.log(
          "❌ FAIL: Super admin creation from environment variables should work"
        );
        console.log(`   Error: ${error.message}`);
      }
    } else {
      console.log("⚠️  SKIP: Super admin environment variables not set");
    }
    console.log("---");

    // Test 3: Try to create regular user
    console.log("3. Testing regular user creation...");
    try {
      const user = new User({
        name: "Regular User",
        email: "regular@example.com",
        password: "password123",
        role: "user",
      });

      await user.save();
      console.log("✅ PASS: Regular user creation allowed");
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
    } catch (error) {
      console.log("❌ FAIL: Regular user creation should work");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 4: Try to create admin user
    console.log("4. Testing admin user creation...");
    try {
      const user = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      });

      await user.save();
      console.log("✅ PASS: Admin user creation allowed");
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
    } catch (error) {
      console.log("❌ FAIL: Admin user creation should work");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }

  console.log("🎯 Direct Validation Tests Complete!");
};

// Run the tests
testValidationDirect();
