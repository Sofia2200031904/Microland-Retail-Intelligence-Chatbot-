import { useEffect, useState } from "react";
import { formatCurrency, formatNumber } from "../utils/formatters";

const circleThemes = [
  "from-[#e8f7c9] via-[#d7f4a8] to-[#c6ee88]",
  "from-[#ffe9bd] via-[#ffd989] to-[#ffc45f]",
  "from-[#e5f0ff] via-[#cfe5ff] to-[#b7d7ff]",
  "from-[#ffe4d9] via-[#ffd1bd] to-[#ffb89d]",
  "from-[#e7f8f1] via-[#cbf0df] to-[#a9e5c7]",
];

function ProductVisual({ product }) {
  const name = product.name.toLowerCase();

  if (name.includes("earpod") || name.includes("earbud")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <path
          d="M42 34c0-8 6-14 14-14s14 6 14 14v18c0 8-6 14-14 14h-2v16c0 6-4 10-10 10"
          stroke="#111827"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M78 46c0-8 6-14 14-14s14 6 14 14v10c0 8-6 14-14 14h-2v12"
          stroke="#111827"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name.includes("headphone")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <path d="M34 61a26 26 0 0 1 52 0" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
        <rect x="24" y="60" width="16" height="28" rx="8" fill="#111827" />
        <rect x="80" y="60" width="16" height="28" rx="8" fill="#111827" />
      </svg>
    );
  }

  if (name.includes("laptop")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <rect x="28" y="30" width="64" height="42" rx="6" fill="#111827" />
        <rect x="20" y="76" width="80" height="10" rx="5" fill="#334155" />
        <rect x="38" y="40" width="44" height="22" rx="3" fill="#9fd4ff" />
      </svg>
    );
  }

  if (name.includes("tv")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <rect x="22" y="28" width="76" height="48" rx="8" fill="#111827" />
        <rect x="32" y="36" width="56" height="32" rx="4" fill="#7cc6ff" />
        <path d="M50 90h20M60 76v14" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }

  if (name.includes("speaker")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <rect x="38" y="24" width="44" height="72" rx="14" fill="#111827" />
        <circle cx="60" cy="46" r="11" fill="#9fd4ff" />
        <circle cx="60" cy="72" r="15" fill="#4f46e5" />
      </svg>
    );
  }

  if (name.includes("watch")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <rect x="47" y="16" width="26" height="20" rx="8" fill="#334155" />
        <rect x="36" y="32" width="48" height="56" rx="14" fill="#111827" />
        <rect x="47" y="84" width="26" height="20" rx="8" fill="#334155" />
        <circle cx="60" cy="60" r="12" fill="#86efac" />
      </svg>
    );
  }

  if (name.includes("jacket")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <path d="M40 28 28 42v42h20V56h8v28h28V42L72 28l-12 10-20-10Z" fill="#2563eb" />
        <path d="M60 38v46" stroke="#dbeafe" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (name.includes("sneaker")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <path
          d="M28 70c12 0 16-10 24-18l10 8c6 5 13 8 22 8h10c4 0 6 3 6 6v6H22v-5c0-3 3-5 6-5Z"
          fill="#111827"
        />
        <path d="M36 74h42" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (name.includes("women") || name.includes("sandals")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <path
          d="M28 72h36c10 0 18 8 28 8v8H24c0-8 2-16 4-16Z"
          fill="#111827"
        />
        <path
          d="M52 56c8 0 12-10 18-16l8 8c-6 10-12 20-26 20"
          stroke="#111827"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M40 72c8-6 14-14 18-24" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }

  if (name.includes("hoodie")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <path d="M42 32c4-7 10-10 18-10s14 3 18 10l10 14v40H32V46l10-14Z" fill="#f59e0b" />
        <path d="M48 44c3 4 7 6 12 6s9-2 12-6" stroke="#fff7ed" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (name.includes("shirt") || name.includes("t-shirt")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <path d="M42 30 28 40l8 18 10-6v34h28V52l10 6 8-18-14-10-10 8H52l-10-8Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" />
      </svg>
    );
  }

  if (name.includes("tablet")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <rect x="30" y="18" width="60" height="84" rx="12" fill="#111827" />
        <rect x="38" y="28" width="44" height="60" rx="6" fill="#bae6fd" />
        <circle cx="60" cy="94" r="3" fill="#cbd5e1" />
      </svg>
    );
  }

  if (name.includes("camera")) {
    return (
      <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
        <rect x="26" y="38" width="68" height="44" rx="10" fill="#111827" />
        <circle cx="60" cy="60" r="14" fill="#7cc6ff" />
        <rect x="36" y="30" width="18" height="10" rx="4" fill="#334155" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" fill="none">
      <circle cx="60" cy="60" r="30" fill="#111827" />
      <circle cx="60" cy="60" r="12" fill="#7cc6ff" />
    </svg>
  );
}

function buildUsageText(product) {
  const tagLabels = {
    audio: "music, calls, and media playback",
    wireless: "wire-free everyday use",
    travel: "travel and commuting",
    music: "focused listening sessions",
    gaming: "gaming and heavy-performance tasks",
    performance: "high-performance work",
    portable: "portable everyday carry",
    fitness: "fitness routines",
    health: "health tracking",
    wearable: "all-day wearable use",
    home: "home setups",
    entertainment: "living room entertainment",
    streaming: "streaming and casual viewing",
    touch: "touch-first browsing",
    security: "home monitoring",
    smart: "connected smart-home usage",
    speaker: "room audio and gatherings",
    buds: "quick on-the-go listening",
    earpods: "compact mobile listening",
    shoes: "daily walking",
    running: "running workouts",
    sport: "sports activity",
    footwear: "everyday wear",
    women: "casual wardrobe styling",
    sandals: "light walking",
    casual: "casual daily use",
    office: "office wear",
    formal: "formal occasions",
    winter: "cool-weather layering",
    warm: "cold-weather comfort",
    basic: "daily basics",
    tablet: "reading and browsing",
    camera: "indoor monitoring",
  };

  const useCases = (product.tags || [])
    .map((tag) => tagLabels[tag] || tag.replace(/-/g, " "))
    .filter(Boolean)
    .slice(0, 3);

  if (!useCases.length) {
    return product.description;
  }

  if (useCases.length === 1) {
    return `Best for ${useCases[0]}.`;
  }

  if (useCases.length === 2) {
    return `Best for ${useCases[0]} and ${useCases[1]}.`;
  }

  return `Best for ${useCases[0]}, ${useCases[1]}, and ${useCases[2]}.`;
}

function buildComplaintHighlights(product) {
  const name = product.name.toLowerCase();

  if (name.includes("headphone") || name.includes("earpod") || name.includes("speaker")) {
    return [
      "A few buyers asked for longer battery life during heavy audio use.",
      "Some customers wanted louder or deeper sound at maximum volume.",
    ];
  }

  if (name.includes("laptop") || name.includes("tablet") || name.includes("tv")) {
    return [
      "A small set of customers reported they needed help with first-time setup.",
      "Some buyers asked for clearer guidance around accessories and warranty coverage.",
    ];
  }

  if (name.includes("watch") || name.includes("camera")) {
    return [
      "A few customers requested simpler app pairing instructions.",
      "Some buyers wanted faster notifications or syncing after setup.",
    ];
  }

  if (name.includes("shoe") || name.includes("footwear") || name.includes("sneaker")) {
    return [
      "A few customers mentioned fit preferences vary by size choice.",
      "Some buyers asked for more color and size availability.",
    ];
  }

  return [
    "A few customers asked for more size or style guidance before purchase.",
    "Some buyers wanted clearer care and usage instructions after delivery.",
  ];
}

function getQualityStats(product) {
  const damagedPieces =
    product.damagedUnits ??
    Math.min(
      Math.max(Number(product.soldUnits || 0), 0),
      Math.max(0, Math.round(Number(product.soldUnits || 0) * 0.03))
    );
  const complaintCount =
    product.customerComplaints ??
    Math.max(
      0,
      Math.round(
        Number(product.soldUnits || 0) * (Number(product.rating || 0) < 4.5 ? 0.05 : 0.03)
      )
    );

  return {
    damagedPieces,
    complaintCount,
    complaintHighlights: product.complaintHighlights?.length
      ? product.complaintHighlights
      : buildComplaintHighlights(product),
  };
}

function TopicTile({ product, index, isSelected, onSelect }) {
  const theme = circleThemes[index % circleThemes.length];

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      aria-pressed={isSelected}
      className={`group flex h-full min-w-0 w-full flex-col items-center rounded-[28px] border px-3 py-5 text-center shadow-sm transition ${
        isSelected
          ? "border-[#216bff] bg-[#f5faff] shadow-[0_18px_38px_rgba(33,107,255,0.12)]"
          : "border-[#edf3f8] bg-[#fbfdff] hover:border-[#d7e7ff] hover:bg-white"
      }`}
      title={product.name}
    >
      <div
        className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${theme} shadow-sm transition duration-200 group-hover:scale-[1.03] sm:h-28 sm:w-28 lg:h-32 lg:w-32`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/75 shadow-sm sm:h-20 sm:w-20 lg:h-24 lg:w-24">
          <ProductVisual product={product} />
        </div>
      </div>

      <h4 className="mt-4 w-full max-w-[170px] break-words text-[1.02rem] font-semibold leading-tight text-[#2f3a47] sm:text-[1.1rem]">
        {product.subcategory}
      </h4>
      <p className="mt-1 min-h-[3.25rem] w-full max-w-[170px] break-words text-sm leading-6 text-[#516170]">
        {product.name}
      </p>
      <p className="mt-2 text-sm font-medium text-[#007185]">
        {formatCurrency(product.price)}
      </p>
    </button>
  );
}

export default function ProductCatalog({
  products,
  preselectedSku = null,
  onSelectProduct,
}) {
  const [selectedSku, setSelectedSku] = useState(preselectedSku);
  const sortedProducts = [...products].sort((a, b) => {
    if (a.category === b.category) {
      return b.rating - a.rating;
    }

    return a.category === "Electronics" ? -1 : 1;
  });
  const selectedProduct =
    sortedProducts.find((item) => item.sku === selectedSku) || null;
  const selectedProductStats = selectedProduct ? getQualityStats(selectedProduct) : null;

  useEffect(() => {
    if (preselectedSku) {
      setSelectedSku(preselectedSku);
    }
  }, [preselectedSku]);

  return (
    <div className="rounded-[28px] border border-[#d6e6f2] bg-white p-4 text-[#131921] shadow-stage sm:rounded-[36px] sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#007185]">
            Curated product grid
          </p>
          <h3 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Electronics-first catalog
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5f6b7a]">
            Browse the available products in one clean collection view, then open any
            item to see its price, stock, quality notes, complaints, and purchase data.
          </p>
        </div>
        <div className="rounded-full border border-[#d6e6f2] bg-[#f7fbff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#232f3e]">
          {products.length} products
        </div>
      </div>

      <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
        {sortedProducts.map((product, index) => (
          <TopicTile
            key={product.sku}
            product={product}
            index={index}
            isSelected={selectedProduct?.sku === product.sku}
            onSelect={(item) => {
              setSelectedSku(item.sku);
              onSelectProduct?.(item);
            }}
          />
        ))}
      </div>

      {selectedProduct ? (
        <div className="mt-8 rounded-[30px] border border-[#d6e6f2] bg-[linear-gradient(180deg,#f9fcff_0%,#eef6ff_100%)] p-5 shadow-[0_20px_48px_rgba(26,41,66,0.08)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#216bff]">
                Product details
              </p>
              <h4 className="mt-2 text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-tight text-[#131921]">
                {selectedProduct.name}
              </h4>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#55677f]">
                {selectedProduct.description}
              </p>
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#216bff] shadow-sm">
              {selectedProduct.rating}/5 stars
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(250px,0.84fr)_minmax(0,1.16fr)]">
            <div className="rounded-[26px] border border-[#dbe8f8] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#007185]">
                Product image
              </p>
              <div
                className={`mt-4 flex h-56 items-center justify-center rounded-[30px] bg-gradient-to-br ${
                  circleThemes[
                    Math.max(
                      0,
                      sortedProducts.findIndex((item) => item.sku === selectedProduct.sku)
                    ) % circleThemes.length
                  ]
                }`}
              >
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/80 shadow-[0_14px_34px_rgba(26,41,66,0.1)]">
                  <div className="origin-center scale-[1.75]">
                    <ProductVisual product={selectedProduct} />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[selectedProduct.category, selectedProduct.subcategory].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#d7e7ff] bg-[#f8fbff] px-3 py-2 text-sm font-medium text-[#4b627d]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-[22px] border border-[#dce9ff] bg-[#f8fbff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#216bff]">
                  Where it can be used
                </p>
                <p className="mt-2 text-[15px] leading-7 text-[#4d627b]">
                  {buildUsageText(selectedProduct)}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  {
                    label: "Price",
                    value: formatCurrency(selectedProduct.price),
                    note: "Current selling price",
                  },
                  {
                    label: "Purchased",
                    value: formatNumber(selectedProduct.soldUnits),
                    note: "Total units purchased",
                  },
                  {
                    label: "Left pieces",
                    value: formatNumber(selectedProduct.stock),
                    note: "Units left in stock",
                  },
                  {
                    label: "Damaged pieces",
                    value: formatNumber(selectedProductStats.damagedPieces),
                    note: "Units flagged in quality checks",
                  },
                  {
                    label: "Customer complaints",
                    value: formatNumber(selectedProductStats.complaintCount),
                    note: "Logged complaints in this demo",
                  },
                  {
                    label: "Review score",
                    value: `${selectedProduct.rating}/5`,
                    note: "Average customer review",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-[#dbe8f8] bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7d96]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-[#131921]">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-[#60738e]">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[24px] border border-[#dbe8f8] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#216bff]">
                      Customer complaints
                    </p>
                    <h5 className="mt-2 text-xl font-semibold text-[#131921]">
                      Common issues customers raised for this product.
                    </h5>
                  </div>
                  <div className="rounded-full bg-[#fff5f5] px-3 py-2 text-sm font-semibold text-[#c45a5a]">
                    {formatNumber(selectedProductStats.complaintCount)} complaints
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  {selectedProductStats.complaintHighlights.map((issue) => (
                    <div
                      key={issue}
                      className="rounded-[20px] border border-[#f1dcdc] bg-[#fffafa] px-4 py-3 text-[15px] leading-7 text-[#6a5860]"
                    >
                      {issue}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-[28px] border border-dashed border-[#cddfed] bg-[#f9fcff] px-5 py-6 text-center text-[15px] leading-7 text-[#60738e]">
          Select any product card to view its image, price, purchased count, stock left,
          damaged pieces, and customer complaints.
        </div>
      )}
    </div>
  );
}
