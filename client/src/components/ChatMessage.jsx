import { Suspense, lazy } from "react";
import MessageInsights from "./MessageInsights";
import { formatCurrency, formatNumber } from "../utils/formatters";

const ChartCard = lazy(() => import("./ChartCard"));

function RecommendationList({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.sku}
          className="rounded-[22px] border border-[#d9e7ff] bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2876ff]">
            {item.category}
          </p>
          <p className="mt-2 text-base font-semibold text-[#1a2942]">{item.name}</p>
          <div className="mt-3 flex items-center justify-between text-[15px] text-[#5b6c86]">
            <span>{formatCurrency(item.price)}</span>
            <span>{formatNumber(item.stock)} in stock</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductDetailCard({ product }) {
  if (!product) {
    return null;
  }

  const metrics = [
    {
      label: "Price",
      value: formatCurrency(product.price),
      note: "Current selling price",
    },
    {
      label: "Total purchased",
      value: formatNumber(product.unitsPurchased),
      note: "Units sold across the catalog",
    },
    {
      label: "Recent customer orders",
      value: formatNumber(product.recentCustomerOrders),
      note: "Orders in the current sales sample",
    },
    {
      label: "Stock left",
      value: formatNumber(product.stockLeft),
      note: "Units available right now",
    },
    {
      label: "Review score",
      value: `${Number(product.rating || 0).toFixed(1)} / 5`,
      note: "Average customer rating",
    },
  ];

  return (
    <div className="mt-4 rounded-[26px] border border-[#cfe1ff] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2876ff]">
            Product detail
          </p>
          <h3 className="mt-2 text-[1.35rem] font-semibold leading-tight text-[#1a2942] sm:text-[1.55rem]">
            {product.name}
          </h3>
        </div>
        <div className="rounded-full bg-[#eef6ff] px-4 py-2 text-sm font-semibold text-[#216bff]">
          {Number(product.rating || 0).toFixed(1)} / 5 stars
        </div>
      </div>

      <p className="mt-3 text-[15px] leading-7 text-[#4e617c]">{product.description}</p>

      <div className="mt-4 rounded-[22px] border border-[#d8e7ff] bg-[#f8fbff] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#216bff]">
          Where it can be used
        </p>
        <p className="mt-2 text-[15px] leading-7 text-[#43566f]">{product.useCases}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-[20px] border border-[#d9e7ff] bg-[#fbfdff] p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6f82a1]">
              {metric.label}
            </p>
            <p className="mt-2 text-lg font-semibold text-[#1a2942]">{metric.value}</p>
            <p className="mt-2 text-sm leading-6 text-[#60738e]">{metric.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[product.category, product.subcategory, `${product.primaryChannel} channel`].map(
          (item) => (
            <span
              key={item}
              className="rounded-full border border-[#d7e7ff] bg-[#f8fbff] px-3 py-2 text-sm font-medium text-[#48627d]"
            >
              {item}
            </span>
          )
        )}
      </div>
    </div>
  );
}

export default function ChatMessage({ message, onAction }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[84%] rounded-[28px] px-5 py-5 shadow-sm md:max-w-[72%] ${
          isUser
            ? "bg-gradient-to-r from-[#3453ff] via-[#1789ff] to-[#13c7ff] text-white shadow-[0_18px_40px_rgba(23,137,255,0.22)]"
            : "border border-[#d9e7ff] bg-[#eef4fb] text-[#1a2942]"
        }`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-[0.2em] ${
            isUser ? "text-white/75" : "text-[#2876ff]"
          }`}
        >
          {isUser ? "You" : "Retail copilot"}
        </p>
        <p className="mt-2 whitespace-pre-line text-[15px] leading-8 md:text-base">
          {message.text}
        </p>

        {!isUser ? <ProductDetailCard product={message.productDetails} /> : null}

        <RecommendationList items={message.recommendations} />

        <Suspense
          fallback={<div className="mt-4 h-64 animate-pulse rounded-[24px] bg-[#dfeeff]" />}
        >
          <ChartCard chart={message.chart} />
        </Suspense>

        {!isUser ? (
          <MessageInsights
            insights={message.insights}
            actions={message.actions}
            prediction={message.prediction}
            alert={message.alert}
            onAction={onAction}
          />
        ) : null}

        {!!message.suggestions?.length && !isUser && (
          <div className="mt-4 flex flex-wrap gap-2">
            {message.suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onAction(item)}
                className="rounded-full border border-[#2b7cff] bg-white px-4 py-2 text-sm font-semibold text-[#216bff] transition hover:bg-[#eef5ff]"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
