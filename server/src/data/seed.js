require("dotenv").config();
const mongoose = require("mongoose");
const { connectToDatabase, isDatabaseConnected } = require("../config/db");
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const User = require("../models/User");
const products = require("./products");
const sales = require("./sales");
const users = require("./users");

async function seedDatabase() {
  await connectToDatabase();

  if (!isDatabaseConnected()) {
    console.log("MongoDB is not connected. Update MONGODB_URI and retry seeding.");
    return;
  }

  await Product.deleteMany({});
  await Sale.deleteMany({});
  await User.deleteMany({});

  await Product.insertMany(products);
  await Sale.insertMany(sales);
  await User.insertMany(users);

  console.log("Sample retail dataset inserted successfully");
}

seedDatabase()
  .catch((error) => {
    console.error("Seeding failed", error);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
