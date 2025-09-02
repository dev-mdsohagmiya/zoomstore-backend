// Script to fix database schema issues
// Run with: node fix-database.js

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function fixDatabase() {
  try {
    console.log("🔧 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    console.log("🔍 Checking for old username field...");
    
    // Check if there are any documents with username field
    const usersWithUsername = await usersCollection.find({ username: { $exists: true } }).toArray();
    
    if (usersWithUsername.length > 0) {
      console.log(`📝 Found ${usersWithUsername.length} users with old username field`);
      
      // Update documents to remove username field and add name field if missing
      for (const user of usersWithUsername) {
        const updateData = {};
        
        // If name field doesn't exist, use username as name
        if (!user.name && user.username) {
          updateData.name = user.username;
        }
        
        // Remove username field
        updateData.$unset = { username: "" };
        
        await usersCollection.updateOne(
          { _id: user._id },
          updateData
        );
        
        console.log(`✅ Updated user: ${user._id}`);
      }
    }

    // Drop the old username index
    try {
      console.log("🗑️ Dropping old username index...");
      await usersCollection.dropIndex("username_1");
      console.log("✅ Dropped username index");
    } catch (error) {
      if (error.code === 27) {
        console.log("ℹ️ Username index doesn't exist (already dropped)");
      } else {
        console.log("⚠️ Could not drop username index:", error.message);
      }
    }

    // Ensure email index exists
    try {
      console.log("🔍 Ensuring email index exists...");
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      console.log("✅ Email index is ready");
    } catch (error) {
      console.log("ℹ️ Email index already exists");
    }

    // Ensure name index exists
    try {
      console.log("🔍 Ensuring name index exists...");
      await usersCollection.createIndex({ name: 1 });
      console.log("✅ Name index is ready");
    } catch (error) {
      console.log("ℹ️ Name index already exists");
    }

    console.log("🎉 Database fix completed successfully!");
    
  } catch (error) {
    console.error("❌ Error fixing database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the fix
fixDatabase();
