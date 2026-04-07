const { buildTopSellingProducts } = require("../utils/analytics");
const { formatCurrencyInr } = require("../utils/currency");

function formatLongDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function formatShortDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}

function buildDailySales(sales) {
  const buckets = sales.reduce((accumulator, sale) => {
    const date = new Date(sale.soldAt).toISOString().slice(0, 10);

    if (!accumulator[date]) {
      accumulator[date] = {
        date,
        revenue: 0,
        units: 0
      };
    }

    accumulator[date].revenue += sale.totalAmount;
    accumulator[date].units += sale.quantity;
    return accumulator;
  }, {});

  return Object.values(buckets).sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getFastMovingLowStock(products) {
  return [...products]
    .filter((item) => item.stock <= 10 && item.soldUnits >= 40)
    .sort((a, b) => b.soldUnits - a.soldUnits || a.stock - b.stock);
}

function buildSalesForecast(sales) {
  const dailySales = buildDailySales(sales);
  if (!dailySales.length) {
    return null;
  }

  const recentWindow = dailySales.slice(-4);
  const previousWindow = dailySales.slice(-8, -4);

  const recentAverageRevenue =
    recentWindow.reduce((sum, item) => sum + item.revenue, 0) / recentWindow.length;
  const previousAverageRevenue = previousWindow.length
    ? previousWindow.reduce((sum, item) => sum + item.revenue, 0) / previousWindow.length
    : recentAverageRevenue;

  const change = previousAverageRevenue
    ? ((recentAverageRevenue - previousAverageRevenue) / previousAverageRevenue) * 100
    : 0;

  let direction = "stable";
  let directionText = "stay steady";

  if (change > 4) {
    direction = "up";
    directionText = "climb";
  } else if (change < -4) {
    direction = "down";
    directionText = "soften";
  }

  const lastDate = new Date(dailySales[dailySales.length - 1].date);
  const startDate = new Date(lastDate);
  startDate.setDate(startDate.getDate() + 1);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const projectedRevenue = recentAverageRevenue * 7;
  const lowerBound = projectedRevenue * 0.92;
  const upperBound = projectedRevenue * 1.08;

  return {
    direction,
    title: "Next-Week Forecast",
    body:
      `Based on the last ${recentWindow.length} sales days, revenue is likely to ${directionText} between ${formatLongDate(
        startDate
      )} and ${formatLongDate(endDate)}. ` +
      `Expected weekly run-rate: ${formatCurrencyInr(lowerBound)} to ${formatCurrencyInr(
        upperBound
      )}.`,
    confidence: previousWindow.length ? "Medium" : "Low"
  };
}

function buildSalesInsights({ sales, products, salesSummary }) {
  const dailySales = buildDailySales(sales);
  const peakDay = [...dailySales].sort((a, b) => b.revenue - a.revenue)[0];
  const fastMovingLowStock = getFastMovingLowStock(products);
  const topProducts = buildTopSellingProducts(sales, 2);
  const forecast = buildSalesForecast(sales);

  const insights = [];

  if (salesSummary.growthRate < 0) {
    insights.push({
      title: "Trend Signal",
      body: `Revenue is down ${Math.abs(salesSummary.growthRate).toFixed(
        1
      )}% compared with the previous period, so the slowdown is large enough to act on.`
    });
  } else {
    insights.push({
      title: "Trend Signal",
      body: `Revenue is up ${salesSummary.growthRate.toFixed(
        1
      )}% compared with the previous period, which suggests current promotions are helping.`
    });
  }

  insights.push({
    title: "Category Strength",
    body: `${salesSummary.bestCategory} remains the strongest category, so it should stay at the center of weekly campaigns.`
  });

  if (peakDay) {
    insights.push({
      title: "Peak Day",
      body: `Sales peaked on ${formatLongDate(peakDay.date)} with ${formatCurrencyInr(
        peakDay.revenue
      )} in revenue.`
    });
  }

  if (fastMovingLowStock.length) {
    const riskiest = fastMovingLowStock[0];
    insights.push({
      title: "Stock Risk",
      body: `${riskiest.name} has only ${riskiest.stock} units left but has already sold ${riskiest.soldUnits} units, so stockouts could be suppressing demand.`
    });
  }

  const actions = [];

  if (fastMovingLowStock.length) {
    actions.push(`Restock ${fastMovingLowStock.slice(0, 2).map((item) => item.name).join(" and ")}`);
  }

  if (topProducts.length) {
    actions.push(`Bundle around ${topProducts[0].name}`);
  }

  actions.push("Ask for revenue share by category");

  const alert = fastMovingLowStock.length
    ? {
        level: "critical",
        title: "Fast movers are at risk",
        body: `${fastMovingLowStock.length} high-demand products are low in stock, which could be contributing to the recent slowdown.`
      }
    : salesSummary.growthRate < 0
      ? {
          level: "warning",
          title: "Revenue needs attention",
          body: "Sales are softer than the previous period, so this is a good time to review promotions and replenishment."
        }
      : null;

  return {
    insights,
    actions,
    prediction: forecast,
    alert
  };
}

function buildInventoryInsights({ products, inventorySummary }) {
  const lowStockProducts = [...products]
    .filter((item) => item.stock <= 10)
    .sort((a, b) => a.stock - b.stock);
  const fastMovingLowStock = getFastMovingLowStock(products);

  const insights = [
    {
      title: "Inventory Pressure",
      body: `${inventorySummary.lowStockCount} products are running low, so replenishment should be a short-term priority.`
    },
    {
      title: "Coverage",
      body: `${inventorySummary.topCategory} currently carries the deepest stock position, which gives you room for bundles and promotions.`
    }
  ];

  if (fastMovingLowStock.length) {
    insights.push({
      title: "Demand Risk",
      body: `${fastMovingLowStock[0].name} is both low in stock and high in demand. Restocking it should protect near-term revenue.`
    });
  }

  const actions = [];

  if (lowStockProducts.length) {
    actions.push(`Restock ${lowStockProducts.slice(0, 2).map((item) => item.name).join(" and ")}`);
  }

  actions.push("Show low-stock products only");
  actions.push("Recommend products to promote this week");

  const alert = lowStockProducts.length
    ? {
        level: "warning",
        title: "Low-stock alert",
        body: `${lowStockProducts.length} products need attention, led by ${lowStockProducts[0].name}.`
      }
    : null;

  return {
    insights,
    actions,
    prediction: null,
    alert
  };
}

function buildProductUseCases(product) {
  const tagLabels = {
    audio: "music and media playback",
    wireless: "cable-free daily use",
    travel: "travel and commuting",
    music: "focused listening",
    gaming: "gaming sessions",
    performance: "high-performance work",
    portable: "portable everyday carry",
    fitness: "fitness tracking",
    health: "health monitoring",
    wearable: "all-day wearable use",
    home: "home setups",
    entertainment: "living room entertainment",
    streaming: "streaming and casual viewing",
    touch: "touch-first browsing",
    security: "home monitoring",
    smart: "connected smart-home routines",
    speaker: "room audio",
    buds: "quick on-the-go listening",
    earpods: "compact mobile listening",
    shoes: "daily walking",
    running: "running workouts",
    sport: "sports activity",
    footwear: "everyday wear",
    women: "casual wardrobe styling",
    sandals: "light walking",
    casual: "casual everyday use",
    office: "office wear",
    formal: "formal occasions",
    winter: "cool-weather layering",
    warm: "cold-weather comfort",
    basic: "daily basics"
  };

  const useCases = (product.tags || [])
    .map((tag) => tagLabels[tag] || tag.replace(/-/g, " "))
    .filter(Boolean)
    .slice(0, 3);

  if (useCases.length === 1) {
    return `Best for ${useCases[0]}.`;
  }

  if (useCases.length === 2) {
    return `Best for ${useCases[0]} and ${useCases[1]}.`;
  }

  if (useCases.length >= 3) {
    return `Best for ${useCases[0]}, ${useCases[1]}, and ${useCases[2]}.`;
  }

  return product.description;
}

function buildProductInsights({ product, products, sales }) {
  const relatedProducts = products
    .filter(
      (item) =>
        item.sku !== product.sku &&
        (item.subcategory === product.subcategory || item.category === product.category)
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 2);
  const productSales = sales.filter((sale) => sale.sku === product.sku);
  const topProducts = buildTopSellingProducts(sales, 5);
  const productTrend = topProducts.find((item) => item.sku === product.sku);
  const recentCustomerOrders = productSales.length;
  const topChannel = productSales.length
    ? productSales.reduce((accumulator, sale) => {
        accumulator[sale.channel] = (accumulator[sale.channel] || 0) + 1;
        return accumulator;
      }, {})
    : null;
  const primaryChannel = topChannel
    ? Object.entries(topChannel).sort((left, right) => right[1] - left[1])[0][0]
    : product.category === "Electronics"
      ? "Online"
      : "Store";

  const insights = [
    {
      title: "Stock Status",
      body:
        product.stock <= 10
          ? `${product.name} is low in stock with only ${product.stock} units left, so it needs replenishment planning.`
          : `${product.name} still has ${product.stock} units in stock, so there is room to promote it.`
    },
    {
      title: "Merchandising Fit",
      body:
        product.rating >= 4.5
          ? `Its ${product.rating}/5 rating makes it a strong hero product for the electronics storefront.`
          : `Its ${product.rating}/5 rating suggests it works better as a supporting product than a headline offer.`
    }
  ];

  if (productTrend) {
    insights.push({
      title: "Demand Signal",
      body: `${product.name} is already among the better-selling items in the current dataset, which makes its stock health more important.`
    });
  }

  const actions = [];
  if (relatedProducts.length) {
    actions.push(`Bundle with ${relatedProducts[0].name}`);
  }
  actions.push("Ask for similar product recommendations");
  actions.push("Check current inventory status");

  return {
    insights,
    actions,
    prediction: null,
    productDetails: {
      sku: product.sku,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      description: product.description,
      useCases: buildProductUseCases(product),
      price: product.price,
      unitsPurchased: product.soldUnits,
      recentCustomerOrders,
      stockLeft: product.stock,
      rating: product.rating,
      primaryChannel
    },
    alert:
      product.stock <= 10
        ? {
            level: "warning",
            title: "This product is running low",
            body: `${product.name} has only ${product.stock} units left.`
          }
        : null
  };
}

function buildRecommendationInsights({ recommendations, message }) {
  if (!recommendations.length) {
    return {
      insights: [
        {
          title: "Recommendation Gap",
          body: "No exact matches were found, so tightening the category or budget will help."
        }
      ],
      actions: ["Try a higher budget", "Ask for best-rated electronics"],
      prediction: null,
      alert: null
    };
  }

  const bestMatch = recommendations[0];
  const mostAffordable = [...recommendations].sort((a, b) => a.price - b.price)[0];

  return {
    insights: [
      {
        title: "Best Match",
        body: `${bestMatch.name} is the strongest overall fit because it combines a ${bestMatch.rating}/5 rating with healthy stock.`
      },
      {
        title: "Budget Option",
        body: `${mostAffordable.name} is the most affordable option in this recommendation set.`
      },
      {
        title: "Decision Context",
        body: `These suggestions were filtered from the current catalog using your request: "${message}".`
      }
    ],
    actions: [
      "Show top-rated electronics",
      "Recommend products for restocking",
      "Ask for product details"
    ],
    prediction: null,
    alert: null
  };
}

function buildSupportInsights() {
  return {
    insights: [
      {
        title: "Automation Scope",
        body: "This support flow is best handled as an FAQ automation with escalation to a human only for exceptions."
      }
    ],
    actions: [
      "Ask about return policy",
      "Ask about shipping timelines",
      "Ask how order tracking works"
    ],
    prediction: null,
    alert: null
  };
}

function buildFallbackInsights() {
  return {
    insights: [
      {
        title: "Try a Stronger Prompt",
        body: "The assistant is strongest on electronics sales, stock, product details, recommendations, and customer support FAQs."
      }
    ],
    actions: [
      "Show inventory status",
      "Give me a sales chart",
      "Recommend the best budget laptop"
    ],
    prediction: null,
    alert: null
  };
}

module.exports = {
  buildSalesInsights,
  buildInventoryInsights,
  buildProductInsights,
  buildRecommendationInsights,
  buildSupportInsights,
  buildFallbackInsights,
  buildSalesForecast,
  formatShortDate,
  formatLongDate
};
