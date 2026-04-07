export function buildDynamicQuickActions(products, salesSummary) {
  const prompts = [];
  const lowStockElectronics = products.filter(
    (item) => item.category === "Electronics" && item.stock <= 10
  );

  if (lowStockElectronics.length) {
    prompts.push("Which electronics need urgent restocking?");
  }

  if ((salesSummary?.growthRate || 0) < 0) {
    prompts.push("Analyze why revenue dropped");
  }

  prompts.push("Predict next week's sales");
  prompts.push("Recommend the best budget laptop");
  prompts.push("What should I promote this week?");

  return prompts.slice(0, 5);
}

export function buildDashboardAlerts(products, salesSummary) {
  const alerts = [];
  const fastMovingLowStock = products
    .filter((item) => item.stock <= 10 && item.soldUnits >= 40)
    .sort((a, b) => b.soldUnits - a.soldUnits || a.stock - b.stock);

  if (fastMovingLowStock.length) {
    alerts.push({
      tone: "critical",
      label: "Business Alert",
      title: `${fastMovingLowStock.length} fast-moving products are close to stockout`,
      body: `${fastMovingLowStock
        .slice(0, 2)
        .map((item) => item.name)
        .join(" and ")} need attention before demand slips further.`,
      actionPrompt: "Which electronics need urgent restocking?",
    });
  }

  if ((salesSummary?.growthRate || 0) < 0) {
    alerts.push({
      tone: "warning",
      label: "Revenue Watch",
      title: `Revenue is down ${Math.abs(salesSummary.growthRate).toFixed(1)}%`,
      body: "Electronics is still the lead category, but the slowdown is large enough to investigate this week.",
      actionPrompt: "Analyze why revenue dropped",
    });
  }

  const bestPromoCandidate = [...products]
    .filter((item) => item.category === "Electronics" && item.stock > 15)
    .sort((a, b) => b.rating - a.rating || b.soldUnits - a.soldUnits)[0];

  if (bestPromoCandidate) {
    alerts.push({
      tone: "positive",
      label: "Promotion Signal",
      title: `${bestPromoCandidate.name} is promotion-ready`,
      body: "Strong rating plus healthy stock makes it a safe product to feature this week.",
      actionPrompt: "What should I promote this week?",
    });
  }

  return alerts.slice(0, 3);
}

export function buildDashboardForecast(products) {
  const candidate = [...products]
    .filter((item) => item.category === "Electronics")
    .sort((a, b) => b.soldUnits - a.soldUnits || b.rating - a.rating)[0];

  if (!candidate) {
    return null;
  }

  return {
    label: "Predictive Insight",
    title: "Audio and computing should lead the next push",
    body: `${candidate.name} has the strongest demand pattern in the current catalog, so it is a good anchor for next week's merchandising plan.`,
    actionPrompt: "Predict next week's sales",
  };
}
