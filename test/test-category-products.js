import dotenv from "dotenv";
import { Category } from "../src/models/category.model.js";
import { Product } from "../src/models/product.model.js";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const testCategoryProducts = async () => {
  console.log("🧪 Testing Category-Product Relationship\n");

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Test 1: Create categories
    console.log("1. Creating test categories...");
    let electronicsCategory, clothingCategory;
    try {
      electronicsCategory = new Category({
        name: "Electronics",
        slug: "electronics",
        image: "https://example.com/electronics.jpg",
      });
      await electronicsCategory.save();

      clothingCategory = new Category({
        name: "Clothing",
        slug: "clothing",
        image: "https://example.com/clothing.jpg",
      });
      await clothingCategory.save();

      console.log("✅ PASS: Categories created successfully");
      console.log(`   Electronics ID: ${electronicsCategory._id}`);
      console.log(`   Clothing ID: ${clothingCategory._id}`);
    } catch (error) {
      console.log("❌ FAIL: Category creation failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 2: Create products with categories
    console.log("2. Creating products with categories...");
    let laptopProduct, shirtProduct;
    try {
      laptopProduct = new Product({
        name: "Gaming Laptop",
        slug: "gaming-laptop",
        description: "High-performance gaming laptop",
        price: 1200,
        stock: 10,
        categories: [electronicsCategory._id],
        photos: [
          "https://example.com/laptop1.jpg",
          "https://example.com/laptop2.jpg",
        ],
      });
      await laptopProduct.save();

      shirtProduct = new Product({
        name: "Cotton T-Shirt",
        slug: "cotton-t-shirt",
        description: "Comfortable cotton t-shirt",
        price: 25,
        stock: 50,
        categories: [clothingCategory._id],
        photos: ["https://example.com/shirt1.jpg"],
      });
      await shirtProduct.save();

      console.log("✅ PASS: Products created successfully");
      console.log(`   Laptop ID: ${laptopProduct._id}`);
      console.log(`   Shirt ID: ${shirtProduct._id}`);
    } catch (error) {
      console.log("❌ FAIL: Product creation failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 3: Manually update categories to include products (simulating controller logic)
    console.log("3. Updating categories to include products...");
    try {
      await Category.updateMany(
        { _id: { $in: [electronicsCategory._id] } },
        { $addToSet: { products: laptopProduct._id } }
      );

      await Category.updateMany(
        { _id: { $in: [clothingCategory._id] } },
        { $addToSet: { products: shirtProduct._id } }
      );

      console.log("✅ PASS: Categories updated with products");
    } catch (error) {
      console.log("❌ FAIL: Category update failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 4: Fetch categories with populated products
    console.log("4. Fetching categories with populated products...");
    try {
      const categoriesWithProducts = await Category.find({})
        .populate("products", "name slug price photos rating numReviews")
        .sort({ createdAt: -1 });

      console.log("✅ PASS: Categories with products retrieved successfully");
      console.log(`   Total Categories: ${categoriesWithProducts.length}`);

      categoriesWithProducts.forEach((category, index) => {
        console.log(`   ${index + 1}. ${category.name} (${category.slug})`);
        console.log(`      Products: ${category.products.length}`);
        category.products.forEach((product, pIndex) => {
          console.log(
            `         ${pIndex + 1}. ${product.name} - $${product.price}`
          );
        });
      });
    } catch (error) {
      console.log("❌ FAIL: Category retrieval with products failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 5: Test product with multiple categories
    console.log("5. Creating product with multiple categories...");
    try {
      const multiCategoryProduct = new Product({
        name: "Smart Watch",
        slug: "smart-watch",
        description: "Smart watch with fitness tracking",
        price: 200,
        stock: 25,
        categories: [electronicsCategory._id, clothingCategory._id],
        photos: ["https://example.com/watch1.jpg"],
      });
      await multiCategoryProduct.save();

      // Update both categories to include this product
      await Category.updateMany(
        { _id: { $in: [electronicsCategory._id, clothingCategory._id] } },
        { $addToSet: { products: multiCategoryProduct._id } }
      );

      console.log("✅ PASS: Multi-category product created successfully");
      console.log(`   Product ID: ${multiCategoryProduct._id}`);
      console.log(`   Categories: ${multiCategoryProduct.categories.length}`);
    } catch (error) {
      console.log("❌ FAIL: Multi-category product creation failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Test 6: Final verification - fetch all categories with products
    console.log("6. Final verification - all categories with products...");
    try {
      const finalCategories = await Category.find({})
        .populate("products", "name slug price")
        .sort({ createdAt: -1 });

      console.log("✅ PASS: Final verification successful");
      finalCategories.forEach((category) => {
        console.log(
          `   📁 ${category.name}: ${category.products.length} products`
        );
        category.products.forEach((product) => {
          console.log(`      📦 ${product.name} - $${product.price}`);
        });
      });
    } catch (error) {
      console.log("❌ FAIL: Final verification failed");
      console.log(`   Error: ${error.message}`);
    }
    console.log("---");

    // Clean up test data
    console.log("7. Cleaning up test data...");
    try {
      await Product.deleteMany({
        name: {
          $in: ["Gaming Laptop", "Cotton T-Shirt", "Smart Watch"],
        },
      });

      await Category.deleteMany({
        name: {
          $in: ["Electronics", "Clothing"],
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

  console.log("🎯 Category-Product Relationship Tests Complete!");
};

// Run the tests
testCategoryProducts();
