const {
  getSales,
  getSalesSummary,
  getTopProducts,
  getStorePerformance
} = require("../services/dataService");

async function fetchSalesSummary(req, res) {
  try {
    const summary = await getSalesSummary();
    return res.json({ summary });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load sales summary" });
  }
}

async function fetchSales(req, res) {
  try {
    const items = await getSales();
    return res.json({ items });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load sales records" });
  }
}

async function fetchTopProducts(req, res) {
  try {
    const items = await getTopProducts();
    return res.json({ items });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load top products" });
  }
}

async function fetchStorePerformance(req, res) {
  try {
    const data = await getStorePerformance();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load store performance" });
  }
}

module.exports = {
  fetchSalesSummary,
  fetchSales,
  fetchTopProducts,
  fetchStorePerformance
};
