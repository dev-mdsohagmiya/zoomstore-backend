import mongoose from "mongoose";
import { User } from "./src/models/user.model.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({
      email: process.env.SUPER_ADMIN_EMAIL,
    });

    if (existingSuperAdmin) {
      console.log(
        "Super admin already exists with email:",
        process.env.SUPER_ADMIN_EMAIL
      );

      // Update role to superadmin if not already
      if (existingSuperAdmin.role !== "superadmin") {
        existingSuperAdmin.role = "superadmin";
        await existingSuperAdmin.save();
        console.log("Updated existing user to super admin role");
      }

      return;
    }

    // Create super admin user
    const superAdmin = await User.create({
      name: "Super Admin",
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD,
      role: "superadmin",
    });

    console.log("Super admin created successfully:");
    console.log("Email:", superAdmin.email);
    console.log("Role:", superAdmin.role);
    console.log("ID:", superAdmin._id);
  } catch (error) {
    console.error("Error creating super admin:", error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the script
createSuperAdmin();
