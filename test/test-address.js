import dotenv from "dotenv";
import { User } from "../src/models/user.model.js";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const testAddress = async () => {
  console.log("🧪 Testing Address Functionality\n");

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Test 1: Create user with address
    console.log("1. Testing user creation with address...");
    try {
      const userWithAddress = new User({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "user",
        address: {
          street: "123 Main Street",
          city: "Dhaka",
          state: "Dhaka",
          zipCode: "1000",
          country: "Bangladesh",
        },
      });

      await userWithAddress.save();
      console.log("✅ PASS: User with address created successfully");
      console.log(`   Name: ${userWithAddress.name}`);
      console.log(`   Email: ${userWithAddress.email}`);
      console.log(
        `   Address: ${JSON.stringify(userWithAddress.address, null, 2)}`
      );
    } catch (error) {
      console.log("❌ FAIL: User with address creation failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 2: Create user without address (should use default country)
    console.log("2. Testing user creation without address...");
    try {
      const userWithoutAddress = new User({
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "password123",
        role: "user",
      });

      await userWithoutAddress.save();
      console.log("✅ PASS: User without address created successfully");
      console.log(`   Name: ${userWithoutAddress.name}`);
      console.log(`   Email: ${userWithoutAddress.email}`);
      console.log(
        `   Address: ${JSON.stringify(userWithoutAddress.address, null, 2)}`
      );
    } catch (error) {
      console.log("❌ FAIL: User without address creation failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 3: Create user with partial address
    console.log("3. Testing user creation with partial address...");
    try {
      const userWithPartialAddress = new User({
        name: "Bob Wilson",
        email: "bob.wilson@example.com",
        password: "password123",
        role: "user",
        address: {
          city: "Chittagong",
          country: "Bangladesh",
        },
      });

      await userWithPartialAddress.save();
      console.log("✅ PASS: User with partial address created successfully");
      console.log(`   Name: ${userWithPartialAddress.name}`);
      console.log(`   Email: ${userWithPartialAddress.email}`);
      console.log(
        `   Address: ${JSON.stringify(userWithPartialAddress.address, null, 2)}`
      );
    } catch (error) {
      console.log("❌ FAIL: User with partial address creation failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 4: Update user address
    console.log("4. Testing user address update...");
    try {
      const user = await User.findOne({ email: "john.doe@example.com" });
      if (user) {
        user.address.street = "456 Updated Street";
        user.address.city = "Sylhet";
        await user.save();

        console.log("✅ PASS: User address updated successfully");
        console.log(
          `   Updated Address: ${JSON.stringify(user.address, null, 2)}`
        );
      } else {
        console.log("❌ FAIL: User not found for address update");
      }
    } catch (error) {
      console.log("❌ FAIL: User address update failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Clean up test data
    console.log("5. Cleaning up test data...");
    try {
      await User.deleteMany({
        email: {
          $in: [
            "john.doe@example.com",
            "jane.smith@example.com",
            "bob.wilson@example.com",
          ],
        },
      });
      console.log("✅ PASS: Test data cleaned up successfully");
    } catch (error) {
      console.log("❌ FAIL: Test data cleanup failed");
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

  console.log("🎯 Address Functionality Tests Complete!");
};

// Run the tests
testAddress();
