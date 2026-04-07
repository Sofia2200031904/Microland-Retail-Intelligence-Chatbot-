const { USD_TO_INR_RATE } = require("../utils/currency");

function extractBudget(message) {
  const match = message.match(/under\s+(?:rs\.?\s*|inr\s*|₹\s*|\$)?(\d+)/i);
  if (!match) {
    return null;
  }

  const rawValue = Number(match[1]);
  const lowerMessage = message.toLowerCase();
  const isUsdBudget = lowerMessage.includes("$") || lowerMessage.includes("usd");

  if (isUsdBudget) {
    return rawValue;
  }

  return rawValue / USD_TO_INR_RATE;
}

function getRecommendations(message, products) {
  const lowerMessage = message.toLowerCase();
  const budget = extractBudget(message);

  let filteredProducts = [...products];

  if (lowerMessage.includes("electronics")) {
    filteredProducts = filteredProducts.filter(
      (item) => item.category === "Electronics"
    );
  }

  if (lowerMessage.includes("clothing") || lowerMessage.includes("fashion")) {
    filteredProducts = filteredProducts.filter((item) => item.category === "Clothing");
  }

  if (lowerMessage.includes("wireless")) {
    filteredProducts = filteredProducts.filter((item) =>
      item.tags.some((tag) => tag.includes("wireless"))
    );
  }

  if (lowerMessage.includes("laptop")) {
    filteredProducts = filteredProducts.filter((item) =>
      item.name.toLowerCase().includes("laptop")
    );
  }

  if (lowerMessage.includes("headphone")) {
    filteredProducts = filteredProducts.filter((item) =>
      item.name.toLowerCase().includes("headphones")
    );
  }

  if (lowerMessage.includes("speaker")) {
    filteredProducts = filteredProducts.filter((item) =>
      item.name.toLowerCase().includes("speaker")
    );
  }

  if (lowerMessage.includes("watch")) {
    filteredProducts = filteredProducts.filter((item) =>
      item.name.toLowerCase().includes("watch")
    );
  }

  if (budget) {
    filteredProducts = filteredProducts.filter((item) => item.price <= budget);
  }

  if (lowerMessage.includes("best") || lowerMessage.includes("top")) {
    filteredProducts = filteredProducts.filter((item) => item.rating >= 4.4);
  }

  return filteredProducts
    .sort((a, b) => b.rating - a.rating || a.price - b.price)
    .slice(0, 4);
}

module.exports = {
  getRecommendations
};
