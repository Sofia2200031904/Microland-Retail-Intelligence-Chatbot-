const { getProducts } = require("../services/dataService");
const { getRecommendations } = require("../services/recommendationService");

async function fetchRecommendations(req, res) {
  try {
    const q = req.query.q || "";
    const products = await getProducts();
    const items = getRecommendations(q, products);
    return res.json({ items });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate recommendations" });
  }
}

module.exports = {
  fetchRecommendations
};
