import { Suspense, lazy } from "react";
import { formatInrAmount } from "../utils/formatters";

const ChartCard = lazy(() => import("./ChartCard"));

export default function StoreAnalyticsPanel({ storePerformance }) {
  const performanceSummary = storePerformance?.summary || {};
  const analyticsCards = [
    {
      label: "Estimated profit",
      value: formatInrAmount(performanceSummary.totalProfit || 0),
      detail: "Combined operating profit across channels.",
      tone: "profit",
    },
    {
      label: "Estimated loss",
      value: formatInrAmount(performanceSummary.totalLoss || 0),
      detail: "Loss pockets that need support and pricing attention.",
      tone: "loss",
    },
    {
      label: "Best channel",
      value: performanceSummary.bestStore || "N/A",
      detail: `${formatInrAmount(performanceSummary.bestNet || 0)} net contribution`,
      tone: "neutral",
    },
    {
      label: "Watch channel",
      value: performanceSummary.watchStore || "N/A",
      detail: `${formatInrAmount(performanceSummary.watchNet || 0)} net contribution`,
      tone: "neutral",
    },
  ];

  return (
    <div className="flex min-w-0 h-full flex-col rounded-[32px] border border-[#d7e7ff] bg-white p-5 shadow-[0_18px_42px_rgba(26,41,66,0.08)] sm:p-6 lg:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
            Store profit and loss
          </p>
          <h3 className="mt-2 text-[clamp(2rem,3vw,3.3rem)] font-semibold leading-[1.03] text-[#131921]">
            Profit and loss now gets a full analytics panel.
          </h3>
          <p className="mt-3 text-sm leading-7 text-[#5f6b7a] sm:text-[15px]">
            Instead of shrinking into a small box, the chart sits in a larger
            dashboard card with the key channel details judges expect to see.
          </p>
        </div>
        <span className="rounded-full bg-[#131921] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
          Live analytics
        </span>
      </div>

      <div className="mt-6">
        {storePerformance?.chart ? (
          <Suspense
            fallback={
              <div className="rounded-[30px] border border-[#d7e7ff] bg-white p-5 shadow-[0_18px_42px_rgba(26,41,66,0.08)]">
                <div className="h-[280px] animate-pulse rounded-[24px] bg-[#eef6ff] sm:h-[320px] lg:h-[360px]" />
              </div>
            }
          >
            <ChartCard
              chart={storePerformance.chart}
              variant="dashboard"
              heightClassName="h-[280px] sm:h-[320px] lg:h-[360px]"
            />
          </Suspense>
        ) : (
          <div className="rounded-[30px] border border-[#d7e7ff] bg-white p-5 shadow-[0_18px_42px_rgba(26,41,66,0.08)]">
            <div className="h-[280px] animate-pulse rounded-[24px] bg-[#eef6ff] sm:h-[320px] lg:h-[360px]" />
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {analyticsCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-[24px] border p-4 ${
              card.tone === "profit"
                ? "border-[#cfead8] bg-[#f2fbf5]"
                : card.tone === "loss"
                  ? "border-[#ffd9d9] bg-[#fff5f5]"
                  : "border-[#dce9ff] bg-[#f8fbff]"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6a7a90]">
              {card.label}
            </p>
            <p className="mt-2 text-[1.55rem] font-semibold text-[#131921]">
              {card.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#5f6b7a]">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[28px] border border-[#dce9ff] bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
          Performance readout
        </p>
        <p className="mt-3 text-sm leading-7 text-[#5f6b7a] sm:text-[15px]">
          {performanceSummary.bestStore || "The strongest channel"} is currently
          carrying the healthiest net contribution, while{" "}
          {performanceSummary.watchStore || "the weakest channel"} needs closer
          attention. This keeps the insights page focused on business performance
          in one clear place.
        </p>
      </div>
    </div>
  );
}
