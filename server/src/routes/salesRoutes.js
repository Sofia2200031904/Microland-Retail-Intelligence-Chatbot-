const express = require("express");
const {
  fetchSalesSummary,
  fetchSales,
  fetchTopProducts,
  fetchStorePerformance
} = require("../controllers/salesController");

const router = express.Router();

router.get("/summary", fetchSalesSummary);
router.get("/store-performance", fetchStorePerformance);
router.get("/", fetchSales);
router.get("/top-products", fetchTopProducts);

module.exports = router;
