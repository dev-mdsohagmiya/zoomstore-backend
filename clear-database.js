// Script to clear the database (use with caution!)
// Run with: node clear-database.js

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function clearDatabase() {
  try {
    console.log("⚠️ WARNING: This will clear all data from the database!");
    console.log("🔧 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("📋 Collections found:", collections.map(c => c.name));

    // Clear all collections
    for (const collection of collections) {
      console.log(`🗑️ Clearing collection: ${collection.name}`);
      await db.collection(collection.name).deleteMany({});
    }

    console.log("🎉 Database cleared successfully!");
    
  } catch (error) {
    console.error("❌ Error clearing database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the clear
clearDatabase();
