const {
  getInventorySummary,
  getLowStockProducts,
  getProducts
} = require("../services/dataService");

async function fetchInventorySummary(req, res) {
  try {
    const summary = await getInventorySummary();
    return res.json({ summary });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load inventory summary" });
  }
}

async function fetchLowStockProducts(req, res) {
  try {
    const items = await getLowStockProducts();
    return res.json({ items });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load low-stock products" });
  }
}

async function fetchProducts(req, res) {
  try {
    const items = await getProducts();
    return res.json({ items });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load products" });
  }
}

module.exports = {
  fetchInventorySummary,
  fetchLowStockProducts,
  fetchProducts
};

