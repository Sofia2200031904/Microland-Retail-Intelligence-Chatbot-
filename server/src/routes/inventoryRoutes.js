const express = require("express");
const {
  fetchInventorySummary,
  fetchLowStockProducts,
  fetchProducts
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/summary", fetchInventorySummary);
router.get("/low-stock", fetchLowStockProducts);
router.get("/products", fetchProducts);

module.exports = router;

