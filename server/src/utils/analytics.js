const { convertUsdToInr } = require("./currency");

function shortLabel(value) {
  if (value.length <= 14) {
    return value;
  }

  return `${value.slice(0, 12)}...`;
}

function buildInventorySummary(products) {
  const totalProducts = products.length;
  const totalUnitsInStock = products.reduce((sum, item) => sum + item.stock, 0);
  const totalInventoryValue = products.reduce(
    (sum, item) => sum + item.stock * item.price,
    0
  );
  const lowStockProducts = products.filter((item) => item.stock <= 10);

  const categoryBuckets = products.reduce((accumulator, item) => {
    accumulator[item.category] = (accumulator[item.category] || 0) + item.stock;
    return accumulator;
  }, {});

  const topCategory =
    Object.entries(categoryBuckets).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return {
    totalProducts,
    totalUnitsInStock,
    totalInventoryValue,
    lowStockCount: lowStockProducts.length,
    topCategory
  };
}

function buildInventoryChart(products) {
  const data = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 6)
    .map((item) => ({
      name: shortLabel(item.name),
      stock: item.stock
    }));

  return {
    type: "bar",
    title: "Stock by Product",
    description: "Highest available stock levels across the catalog.",
    xKey: "name",
    series: [{ key: "stock", color: "#f59e0b" }],
    data
  };
}

function buildLowStockChart(products) {
  const data = [...products]
    .filter((item) => item.stock <= 15)
    .sort((a, b) => a.stock - b.stock)
    .map((item) => ({
      name: shortLabel(item.name),
      stock: item.stock
    }));

  return {
    type: "bar",
    title: "Low-Stock Alert",
    description: "Products that need replenishment soon.",
    xKey: "name",
    series: [{ key: "stock", color: "#ef4444" }],
    data
  };
}

function buildSalesSummary(sales) {
  const totalRevenue = sales.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalOrders = sales.length;
  const totalUnitsSold = sales.reduce((sum, item) => sum + item.quantity, 0);
  const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  const categoryRevenue = sales.reduce((accumulator, sale) => {
    accumulator[sale.category] =
      (accumulator[sale.category] || 0) + sale.totalAmount;
    return accumulator;
  }, {});

  const sortedCategories = Object.entries(categoryRevenue).sort(
    (a, b) => b[1] - a[1]
  );

  const midpoint = Math.ceil(sales.length / 2);
  const earlierRevenue = sales
    .slice(0, midpoint)
    .reduce((sum, sale) => sum + sale.totalAmount, 0);
  const laterRevenue = sales
    .slice(midpoint)
    .reduce((sum, sale) => sum + sale.totalAmount, 0);

  const growthRate = earlierRevenue
    ? ((laterRevenue - earlierRevenue) / earlierRevenue) * 100
    : 0;

  return {
    totalRevenue,
    totalOrders,
    totalUnitsSold,
    averageOrderValue,
    bestCategory: sortedCategories[0]?.[0] || "N/A",
    growthRate
  };
}

function estimateStoreOperatingRate(sale) {
  const baseRate = sale.category === "Electronics" ? 0.78 : 0.6;
  const channelRateMap = {
    Store: 0.1,
    Online: 0.14,
    Marketplace: 0.22
  };
  const customerRate = sale.customerType === "New" ? 0.06 : 0.04;

  return baseRate + (channelRateMap[sale.channel] || 0.12) + customerRate;
}

function buildStorePerformanceBreakdown(sales) {
  const buckets = sales.reduce((accumulator, sale) => {
    const store = sale.channel || "Store";
    const operatingRate = estimateStoreOperatingRate(sale);
    const netUsd = sale.totalAmount * (1 - operatingRate);
    const profit = convertUsdToInr(Math.max(netUsd, 0));
    const loss = convertUsdToInr(Math.max(-netUsd, 0));
    const revenue = convertUsdToInr(sale.totalAmount);

    if (!accumulator[store]) {
      accumulator[store] = {
        store,
        revenue: 0,
        profit: 0,
        loss: 0,
        net: 0
      };
    }

    accumulator[store].revenue += revenue;
    accumulator[store].profit += profit;
    accumulator[store].loss += loss;
    accumulator[store].net += profit - loss;
    return accumulator;
  }, {});

  return Object.values(buckets).sort((left, right) => right.revenue - left.revenue);
}

function buildStoreProfitLossChart(sales) {
  const data = buildStorePerformanceBreakdown(sales).map((item) => ({
    store: item.store,
    profit: item.profit,
    loss: item.loss,
    net: item.net
  }));

  return {
    type: "bar",
    title: "Store Profit vs Loss",
    description:
      "Estimated operating profit and loss by sales channel in the current retail dataset.",
    xKey: "store",
    series: [
      { key: "profit", color: "#16a34a" },
      { key: "loss", color: "#ef4444" }
    ],
    data
  };
}

function buildStorePerformanceSummary(sales) {
  const breakdown = buildStorePerformanceBreakdown(sales);

  const bestStore = [...breakdown].sort((left, right) => right.net - left.net)[0];
  const watchStore = [...breakdown].sort((left, right) => left.net - right.net)[0];

  return {
    totalProfit: breakdown.reduce((sum, item) => sum + item.profit, 0),
    totalLoss: breakdown.reduce((sum, item) => sum + item.loss, 0),
    bestStore: bestStore?.store || "N/A",
    bestNet: bestStore?.net || 0,
    watchStore: watchStore?.store || "N/A",
    watchNet: watchStore?.net || 0
  };
}

function buildSalesTrendChart(sales) {
  const buckets = sales.reduce((accumulator, sale) => {
    const date = new Date(sale.soldAt).toISOString().slice(5, 10);
    if (!accumulator[date]) {
      accumulator[date] = { date, revenue: 0, units: 0 };
    }

    accumulator[date].revenue += convertUsdToInr(sale.totalAmount);
    accumulator[date].units += sale.quantity;
    return accumulator;
  }, {});

  return {
    type: "line",
    title: "Sales Trend",
    description: "Revenue and units sold across recent orders.",
    xKey: "date",
    series: [
      { key: "revenue", color: "#0ea5e9" },
      { key: "units", color: "#22c55e" }
    ],
    data: Object.values(buckets)
  };
}

function buildCategorySalesChart(sales) {
  const buckets = sales.reduce((accumulator, sale) => {
    accumulator[sale.category] =
      (accumulator[sale.category] || 0) + convertUsdToInr(sale.totalAmount);
    return accumulator;
  }, {});

  return {
    type: "pie",
    title: "Revenue Share by Category",
    description: "How revenue is distributed across product categories.",
    xKey: "name",
    dataKey: "value",
    data: Object.entries(buckets).map(([name, value]) => ({ name, value }))
  };
}

function buildTopSellingProducts(sales, limit = 4) {
  const buckets = sales.reduce((accumulator, sale) => {
    if (!accumulator[sale.sku]) {
      accumulator[sale.sku] = {
        sku: sale.sku,
        name: sale.productName,
        quantity: 0,
        revenue: 0
      };
    }

    accumulator[sale.sku].quantity += sale.quantity;
    accumulator[sale.sku].revenue += sale.totalAmount;
    return accumulator;
  }, {});

  return Object.values(buckets)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

module.exports = {
  buildInventorySummary,
  buildInventoryChart,
  buildLowStockChart,
  buildSalesSummary,
  buildSalesTrendChart,
  buildCategorySalesChart,
  buildTopSellingProducts,
  buildStoreProfitLossChart,
  buildStorePerformanceSummary
};
