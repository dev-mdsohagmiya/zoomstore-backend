// Complete database fix script
// Run with: node fix-database-complete.js

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function fixDatabaseComplete() {
  try {
    console.log("🔧 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;

    // Drop the entire users collection to remove all indexes
    try {
      console.log("🗑️ Dropping users collection completely...");
      await db.collection("users").drop();
      console.log("✅ Users collection dropped");
    } catch (error) {
      if (error.code === 26) {
        console.log("ℹ️ Users collection doesn't exist (already dropped)");
      } else {
        console.log("⚠️ Could not drop users collection:", error.message);
      }
    }

    // Drop other collections that might have old data
    const collectionsToDrop = ["posts", "sessions", "accounts"];
    for (const collectionName of collectionsToDrop) {
      try {
        console.log(`🗑️ Dropping ${collectionName} collection...`);
        await db.collection(collectionName).drop();
        console.log(`✅ ${collectionName} collection dropped`);
      } catch (error) {
        if (error.code === 26) {
          console.log(`ℹ️ ${collectionName} collection doesn't exist`);
        } else {
          console.log(
            `⚠️ Could not drop ${collectionName} collection:`,
            error.message
          );
        }
      }
    }

    // Create fresh users collection with proper indexes
    console.log("🔨 Creating fresh users collection...");
    const usersCollection = db.collection("users");

    // Create proper indexes
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log("✅ Email index created");

    await usersCollection.createIndex({ name: 1 });
    console.log("✅ Name index created");

    console.log("🎉 Database completely fixed!");
  } catch (error) {
    console.error("❌ Error fixing database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the complete fix
fixDatabaseComplete();
