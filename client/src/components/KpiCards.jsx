import { formatCurrency, formatNumber, formatPercent } from "../utils/formatters";

export default function KpiCards({ inventorySummary, salesSummary }) {
  const cards = [
    {
      label: "Products",
      value: formatNumber(inventorySummary?.totalProducts),
      note: `${formatNumber(inventorySummary?.lowStockCount)} low-stock items`,
    },
    {
      label: "Units In Stock",
      value: formatNumber(inventorySummary?.totalUnitsInStock),
      note: `${inventorySummary?.topCategory || "N/A"} leading`,
    },
    {
      label: "Revenue",
      value: formatCurrency(salesSummary?.totalRevenue),
      note: `${formatNumber(salesSummary?.totalOrders)} orders`,
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(salesSummary?.averageOrderValue),
      note: `${formatPercent(salesSummary?.growthRate)} vs prior period`,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="h-full rounded-[24px] border border-[#d6e6f2] bg-white p-4 shadow-sm"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5f6b7a]">
            {card.label}
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#131921]">{card.value}</p>
          <p className="mt-2 text-xs text-[#66788c]">{card.note}</p>
        </div>
      ))}
    </div>
  );
}
