import dotenv from "dotenv";
import { Category } from "../src/models/category.model.js";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const testCategoryImage = async () => {
  console.log("🧪 Testing Category Image Functionality\n");

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Test 1: Create category with image URL
    console.log("1. Testing category creation with image...");
    try {
      const categoryWithImage = new Category({
        name: "Electronics",
        slug: "electronics",
        image: "https://example.com/electronics.jpg",
      });

      await categoryWithImage.save();
      console.log("✅ PASS: Category with image created successfully");
      console.log(`   Name: ${categoryWithImage.name}`);
      console.log(`   Slug: ${categoryWithImage.slug}`);
      console.log(`   Image: ${categoryWithImage.image}`);
    } catch (error) {
      console.log("❌ FAIL: Category with image creation failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 2: Create category without image
    console.log("2. Testing category creation without image...");
    try {
      const categoryWithoutImage = new Category({
        name: "Clothing",
        slug: "clothing",
      });

      await categoryWithoutImage.save();
      console.log("✅ PASS: Category without image created successfully");
      console.log(`   Name: ${categoryWithoutImage.name}`);
      console.log(`   Slug: ${categoryWithoutImage.slug}`);
      console.log(`   Image: ${categoryWithoutImage.image || "No image"}`);
    } catch (error) {
      console.log("❌ FAIL: Category without image creation failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 3: Update category image
    console.log("3. Testing category image update...");
    try {
      const category = await Category.findOne({ name: "Electronics" });
      if (category) {
        category.image = "https://example.com/updated-electronics.jpg";
        await category.save();

        console.log("✅ PASS: Category image updated successfully");
        console.log(`   Updated Image: ${category.image}`);
      } else {
        console.log("❌ FAIL: Category not found for image update");
      }
    } catch (error) {
      console.log("❌ FAIL: Category image update failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 4: Test slug generation
    console.log("4. Testing automatic slug generation...");
    try {
      const categoryWithSlug = new Category({
        name: "Home & Garden",
      });

      await categoryWithSlug.save();
      console.log("✅ PASS: Category slug generated automatically");
      console.log(`   Name: ${categoryWithSlug.name}`);
      console.log(`   Generated Slug: ${categoryWithSlug.slug}`);
    } catch (error) {
      console.log("❌ FAIL: Category slug generation failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 5: Test category retrieval
    console.log("5. Testing category retrieval...");
    try {
      const categories = await Category.find({});
      console.log("✅ PASS: Categories retrieved successfully");
      console.log(`   Total Categories: ${categories.length}`);
      categories.forEach((cat, index) => {
        console.log(
          `   ${index + 1}. ${cat.name} (${cat.slug}) - Image: ${cat.image || "None"}`
        );
      });
    } catch (error) {
      console.log("❌ FAIL: Category retrieval failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Clean up test data
    console.log("6. Cleaning up test data...");
    try {
      await Category.deleteMany({
        name: {
          $in: ["Electronics", "Clothing", "Home & Garden"],
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

  console.log("🎯 Category Image Functionality Tests Complete!");
};

// Run the tests
testCategoryImage();
