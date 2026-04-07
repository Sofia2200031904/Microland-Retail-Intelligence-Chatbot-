const {
  buildCategorySalesChart,
  buildInventoryChart,
  buildLowStockChart,
  buildSalesTrendChart,
  buildStoreProfitLossChart,
  buildStorePerformanceSummary
} = require("../utils/analytics");
const { formatCurrencyInr } = require("../utils/currency");
const {
  getProducts,
  getSales,
  getInventorySummary,
  getSalesSummary
} = require("./dataService");
const { detectIntent } = require("./intentService");
const { getRecommendations } = require("./recommendationService");
const { enhanceReplyWithOpenAI } = require("./openaiService");
const {
  buildSalesInsights,
  buildInventoryInsights,
  buildProductInsights,
  buildRecommendationInsights,
  buildSupportInsights,
  buildFallbackInsights
} = require("./insightService");

const responseCache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 5;

function getCacheKey(message, conversationContext) {
  return JSON.stringify({
    message: message.trim().toLowerCase(),
    lastIntent: conversationContext?.lastIntent || "",
    lastProductSku: conversationContext?.lastProductSku || "",
    lastTopic: conversationContext?.lastTopic || ""
  });
}

function getCachedResponse(cacheKey) {
  const cachedItem = responseCache.get(cacheKey);
  if (!cachedItem) {
    return null;
  }

  if (Date.now() - cachedItem.createdAt > CACHE_TTL_MS) {
    responseCache.delete(cacheKey);
    return null;
  }

  return cachedItem.value;
}

function setCachedResponse(cacheKey, value) {
  responseCache.set(cacheKey, {
    createdAt: Date.now(),
    value
  });
}

function buildCustomerServiceReply(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("track") || lowerMessage.includes("order status")) {
    return "Customers can track an order from the Orders page using their order ID and email. A support agent can also verify shipment status from the admin dashboard.";
  }

  if (
    lowerMessage.includes("return") ||
    lowerMessage.includes("refund") ||
    lowerMessage.includes("exchange")
  ) {
    return "The best starter policy is a 14-day return or exchange window for unused items with proof of purchase. Keep that flow automated, but escalate damaged or disputed orders to a human agent.";
  }

  if (lowerMessage.includes("shipping") || lowerMessage.includes("delivery")) {
    return "A strong default response is: standard shipping takes 3 to 5 business days, express shipping takes 1 to 2 business days, and tracking is sent by email after dispatch.";
  }

  if (lowerMessage.includes("cancel")) {
    return "Orders can usually be canceled before shipment confirmation. Once shipped, the chatbot should guide the customer into the return flow instead of promising a cancellation.";
  }

  return "I can automate common support flows like order tracking, shipping timelines, return policies, and cancellation guidance. Anything outside those FAQs should escalate to a support teammate.";
}

function buildContextMemory({
  intent,
  referencedProduct,
  chart,
  conversationContext
}) {
  return {
    lastIntent: intent,
    lastProductSku: referencedProduct?.sku || conversationContext?.lastProductSku || null,
    lastTopic: referencedProduct?.name || intent,
    lastChartType: chart?.type || conversationContext?.lastChartType || null
  };
}

function buildLatestSalesWindow(sales) {
  if (!sales.length) {
    return null;
  }

  const sortedDates = sales
    .map((sale) => new Date(sale.soldAt))
    .sort((a, b) => a - b);
  const endDate = sortedDates[sortedDates.length - 1];
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 6);

  return {
    start: startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }),
    end: endDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    })
  };
}

async function processChatMessage(message, conversationContext = {}) {
  const cacheKey = getCacheKey(message, conversationContext);
  const cachedResponse = getCachedResponse(cacheKey);

  if (cachedResponse) {
    return cachedResponse;
  }

  const [products, sales, inventorySummary, salesSummary] = await Promise.all([
    getProducts(),
    getSales(),
    getInventorySummary(),
    getSalesSummary()
  ]);

  const intentResult = detectIntent(message, products, conversationContext);
  const response = {
    intent: intentResult.intent,
    reply: "",
    chart: null,
    productDetails: null,
    recommendations: [],
    followUpPrompts: [],
    insights: [],
    actions: [],
    prediction: null,
    alert: null,
    contextMemory: {}
  };

  if (intentResult.intent === "inventory") {
    const lowStockProducts = products.filter((item) => item.stock <= 10);
    const topRiskLabel = lowStockProducts.length
      ? `${lowStockProducts[0].name} is the most urgent restock with only ${lowStockProducts[0].stock} units left.`
      : "No products are currently in the low-stock zone.";

    response.reply =
      `${inventorySummary.lowStockCount} products are currently low in stock. ` +
      `${inventorySummary.topCategory} still has the deepest inventory coverage, but ${topRiskLabel} ` +
      `If you want a quick win, focus on fast-moving electronics before the next selling cycle.`;
    response.chart = message.toLowerCase().includes("low")
      ? buildLowStockChart(products)
      : buildInventoryChart(products);
    response.followUpPrompts = [
      "Which electronics need urgent restocking?",
      "What should I promote this week?",
      "Recommend products we should bundle"
    ];

    Object.assign(
      response,
      buildInventoryInsights({
        products,
        inventorySummary
      })
    );
  } else if (intentResult.intent === "sales") {
    const salesInsightPack = buildSalesInsights({
      sales,
      products,
      salesSummary
    });
    const lowerMessage = message.toLowerCase();
    const wantsProfitLoss =
      lowerMessage.includes("profit") ||
      lowerMessage.includes("loss") ||
      lowerMessage.includes("margin") ||
      lowerMessage.includes("store");
    const latestSalesWindow = buildLatestSalesWindow(sales);
    const referencesRecentPeriod =
      message.toLowerCase().includes("last week") ||
      message.toLowerCase().includes("this week");
    const storePerformanceSummary = buildStorePerformanceSummary(sales);

    response.reply = wantsProfitLoss
      ? `${storePerformanceSummary.bestStore} is the strongest channel on estimated profit, while ${storePerformanceSummary.watchStore} needs margin attention. This profit-loss view helps you see where channel economics are helping or hurting the business.`
      : salesSummary.growthRate < 0
        ? `Revenue dropped ${Math.abs(salesSummary.growthRate).toFixed(
            1
          )}% compared with the previous period. ${salesSummary.bestCategory} is still your strongest category, but low-stock fast movers may be holding back performance.`
        : `Revenue increased ${salesSummary.growthRate.toFixed(
            1
          )}% compared with the previous period. ${salesSummary.bestCategory} remains your strongest category, so this is a good time to scale winning campaigns.`;

    if (referencesRecentPeriod && latestSalesWindow) {
      response.reply += ` In this demo dataset, the latest week runs from ${latestSalesWindow.start} to ${latestSalesWindow.end}.`;
    }

    response.chart = wantsProfitLoss
      ? buildStoreProfitLossChart(sales)
      : intentResult.chartPreference === "pie"
        ? buildCategorySalesChart(sales)
        : buildSalesTrendChart(sales);
    response.followUpPrompts = [
      "Analyze why revenue changed",
      "Show revenue share by category",
      "Predict next week's sales",
      "Show store profit and loss"
    ];

    Object.assign(response, salesInsightPack);
  } else if (intentResult.intent === "product" && intentResult.referencedProduct) {
    const product = intentResult.referencedProduct;
    const productSales = sales.filter((sale) => sale.sku === product.sku);
    const recentOrders = productSales.length;
    response.reply =
      `${product.name} is priced at ${formatCurrencyInr(product.price)} and is best suited for ${product.tags
        .slice(0, 2)
        .join(" and ")} use. ` +
      `The catalog shows ${product.soldUnits} total units purchased, ${product.stock} units left in stock, and a ${product.rating}/5 review score. ` +
      `${recentOrders ? `It also appears in ${recentOrders} recent customer orders. ` : ""}` +
      `${product.stock <= 10 ? "It is running low, so replenishment matters." : "It still has enough stock to support discovery and promotions."}`;
    response.followUpPrompts = [
      "Recommend similar products",
      "Should I restock this item?",
      "Show current inventory status"
    ];

    Object.assign(
      response,
      buildProductInsights({
        product,
        products,
        sales
      })
    );
  } else if (intentResult.intent === "recommendation") {
    const recommendations = getRecommendations(message, products);
    response.recommendations = recommendations;
    response.reply = recommendations.length
      ? `I picked ${recommendations.length} products that fit your request. The top option balances rating, stock health, and price, so the list is designed to be actionable instead of generic.`
      : "I could not find a perfect match. Try tightening the category, budget, or product type, for example: recommend the best budget laptop under Rs. 60000.";
    response.followUpPrompts = [
      "Recommend the best budget laptop",
      "Suggest top-rated headphones",
      "Show details for the smartwatch"
    ];

    Object.assign(
      response,
      buildRecommendationInsights({
        recommendations,
        message
      })
    );
  } else if (intentResult.intent === "customer_service") {
    response.reply = buildCustomerServiceReply(message);
    response.followUpPrompts = [
      "How can customers track an order?",
      "What is the return policy?",
      "How does shipping work?"
    ];

    Object.assign(response, buildSupportInsights());
  } else if (intentResult.intent === "greeting") {
    response.reply =
      "Hello. I am your electronics retail copilot. I can explain sales changes, surface stock risks, recommend products, and automate common support answers.";
    response.followUpPrompts = [
      "Show me current inventory status",
      "Give me a sales chart",
      "Recommend the best budget laptop"
    ];

    Object.assign(response, buildFallbackInsights());
  } else {
    response.reply =
      "I did not fully understand that request. Try asking about electronics sales, stock alerts, product details, recommendations, or customer support FAQs.";
    response.followUpPrompts = [
      "Show me current inventory status",
      "Analyze why revenue changed",
      "Recommend the best budget laptop"
    ];

    Object.assign(response, buildFallbackInsights());
  }

  response.reply = await enhanceReplyWithOpenAI({
    userMessage: message,
    structuredReply: response.reply,
    inventorySummary,
    salesSummary,
    insightSummary: response.insights.map((item) => `${item.title}: ${item.body}`).join(" ")
  });

  response.contextMemory = buildContextMemory({
    intent: response.intent,
    referencedProduct: intentResult.referencedProduct,
    chart: response.chart,
    conversationContext
  });

  setCachedResponse(cacheKey, response);
  return response;
}

module.exports = {
  processChatMessage
};
