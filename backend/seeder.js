require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");

const Product = require("./models/Product");
const Category = require("./models/Category");

const products = require("./data/products");
const categories = require("./data/categories");

connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();

    // Insert categories first
    const createdCategories = await Category.insertMany(categories);

    // Create a map of category name -> category ID
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Map each product's category string name to its category ObjectId
    const sampleProducts = products.map((prod) => {
      const catId = categoryMap[prod.category];
      if (!catId) {
        throw new Error(`Category not found for product: ${prod.name}`);
      }
      return {
        ...prod,
        category: catId,
      };
    });

    // Insert products with mapped Category IDs
    await Product.insertMany(sampleProducts);

    console.log("DATA IMPORTED");
    process.exit();
  } catch (error) {
    console.error("DATA IMPORT FAILED:", error);
    process.exit(1);
  }
};

importData();