function findReferencedProduct(message, products) {
  const lowerMessage = message.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const product of products) {
    const lowerName = product.name.toLowerCase();

    if (
      lowerMessage.includes(lowerName) ||
      lowerMessage.includes(product.sku.toLowerCase())
    ) {
      return product;
    }

    const tokens = lowerName.split(/[^a-z0-9]+/).filter((token) => token.length > 3);
    const score = tokens.reduce(
      (sum, token) => sum + (lowerMessage.includes(token) ? 1 : 0),
      0
    );

    if (score > bestScore) {
      bestMatch = product;
      bestScore = score;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

function detectIntent(message, products, conversationContext = {}) {
  const lowerMessage = message.toLowerCase();

  const greetingKeywords = ["hello", "hi", "hey", "good morning", "good evening"];
  const inventoryKeywords = [
    "inventory",
    "stock",
    "replenish",
    "warehouse",
    "restock",
    "low-stock"
  ];
  const salesKeywords = [
    "sales",
    "revenue",
    "orders",
    "analytics",
    "performance",
    "decline",
    "forecast",
    "predict",
    "profit",
    "loss",
    "margin"
  ];
  const recommendationKeywords = ["recommend", "suggest", "best", "popular", "promote"];
  const customerServiceKeywords = [
    "return",
    "refund",
    "exchange",
    "track",
    "shipping",
    "delivery",
    "support",
    "order status",
    "cancel",
    "customer service"
  ];
  const chartKeywords = ["chart", "graph", "visual", "trend", "plot"];
  const followUpKeywords = [
    "what about",
    "what happened next",
    "last week",
    "this week",
    "tell me more",
    "why",
    "that",
    "those",
    "same"
  ];

  const wantsChart = chartKeywords.some((keyword) => lowerMessage.includes(keyword));
  const isFollowUp = followUpKeywords.some((keyword) => lowerMessage.includes(keyword));
  const productFollowUpKeywords = ["it", "that product", "this product", "that item"];
  let referencedProduct = findReferencedProduct(message, products);

  if (
    !referencedProduct &&
    conversationContext.lastProductSku &&
    (isFollowUp || productFollowUpKeywords.some((keyword) => lowerMessage.includes(keyword)))
  ) {
    referencedProduct =
      products.find((item) => item.sku === conversationContext.lastProductSku) || null;
  }
  const wantsRecommendation = recommendationKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );
  const continuesProductThread =
    !!referencedProduct &&
    conversationContext.lastIntent === "product" &&
    (isFollowUp || productFollowUpKeywords.some((keyword) => lowerMessage.includes(keyword)));
  const asksCustomerService = customerServiceKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );
  const asksInventory = inventoryKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );
  const asksSales = salesKeywords.some((keyword) => lowerMessage.includes(keyword));
  const isGreeting = greetingKeywords.some((keyword) => lowerMessage.includes(keyword));

  let chartPreference = "bar";
  if (
    lowerMessage.includes("trend") ||
    lowerMessage.includes("month") ||
    lowerMessage.includes("daily") ||
    lowerMessage.includes("over time")
  ) {
    chartPreference = "line";
  }
  if (
    lowerMessage.includes("category") ||
    lowerMessage.includes("distribution") ||
    lowerMessage.includes("share")
  ) {
    chartPreference = "pie";
  }

  let intent = "unknown";

  if (asksCustomerService) {
    intent = "customer_service";
  } else if (wantsRecommendation) {
    intent = "recommendation";
  } else if (continuesProductThread) {
    intent = "product";
  } else if (asksInventory) {
    intent = "inventory";
  } else if (asksSales || wantsChart) {
    intent = lowerMessage.includes("inventory") ? "inventory" : "sales";
  } else if (referencedProduct) {
    intent = "product";
  } else if (isGreeting) {
    intent = "greeting";
  }

  if (intent === "unknown" && isFollowUp && conversationContext.lastIntent) {
    intent = conversationContext.lastIntent;
  }

  if (
    intent === "unknown" &&
    conversationContext.lastIntent === "product" &&
    conversationContext.lastProductSku
  ) {
    intent = "product";
    referencedProduct =
      products.find((item) => item.sku === conversationContext.lastProductSku) || null;
  }

  return {
    intent,
    wantsChart,
    chartPreference,
    referencedProduct,
    isFollowUp
  };
}

module.exports = {
  detectIntent,
  findReferencedProduct
};
