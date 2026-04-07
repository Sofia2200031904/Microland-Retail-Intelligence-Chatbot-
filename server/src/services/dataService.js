const Product = require("../models/Product");
const Sale = require("../models/Sale");
const User = require("../models/User");
const products = require("../data/products");
const sales = require("../data/sales");
const users = require("../data/users");
const { isDatabaseConnected } = require("../config/db");
const {
  buildInventorySummary,
  buildSalesSummary,
  buildTopSellingProducts,
  buildStoreProfitLossChart,
  buildStorePerformanceSummary
} = require("../utils/analytics");

function mergeSampleRecords(primaryRecords, sampleRecords, key) {
  const merged = new Map(primaryRecords.map((record) => [record[key], record]));

  for (const sampleRecord of sampleRecords) {
    if (!merged.has(sampleRecord[key])) {
      merged.set(sampleRecord[key], sampleRecord);
    }
  }

  return Array.from(merged.values());
}

async function getProducts() {
  if (isDatabaseConnected()) {
    try {
      const databaseProducts = await Product.find().lean();
      return mergeSampleRecords(databaseProducts, products, "sku");
    } catch (error) {
      console.warn("Could not read products from MongoDB. Using sample data.");
    }
  }

  return products;
}

async function getSales() {
  if (isDatabaseConnected()) {
    try {
      const databaseSales = await Sale.find().sort({ soldAt: 1 }).lean();
      return mergeSampleRecords(databaseSales, sales, "orderId").sort(
        (left, right) => new Date(left.soldAt) - new Date(right.soldAt)
      );
    } catch (error) {
      console.warn("Could not read sales from MongoDB. Using sample data.");
    }
  }

  return sales;
}

async function getUsers() {
  if (isDatabaseConnected()) {
    try {
      return await User.find().lean();
    } catch (error) {
      console.warn("Could not read users from MongoDB. Using sample data.");
    }
  }

  return users;
}

async function getInventorySummary() {
  const productList = await getProducts();
  return buildInventorySummary(productList);
}

async function getSalesSummary() {
  const salesList = await getSales();
  return buildSalesSummary(salesList);
}

async function getLowStockProducts() {
  const productList = await getProducts();
  return productList.filter((item) => item.stock <= 10);
}

async function getTopProducts() {
  const salesList = await getSales();
  return buildTopSellingProducts(salesList);
}

async function getStorePerformance() {
  const salesList = await getSales();

  return {
    chart: buildStoreProfitLossChart(salesList),
    summary: buildStorePerformanceSummary(salesList)
  };
}

module.exports = {
  getProducts,
  getSales,
  getUsers,
  getInventorySummary,
  getSalesSummary,
  getLowStockProducts,
  getTopProducts,
  getStorePerformance
};
