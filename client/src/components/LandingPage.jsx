export default function LandingPage({
  projectCapabilities,
  retailSections,
  featuredProduct,
  onEnterCockpit,
  onViewSmartAlerts,
  onOpenProductInsight,
  isStacked = false,
}) {
  return (
    <section
      className={`py-1 sm:py-2 ${
        isStacked ? "" : "flex min-h-full flex-1"
      }`}
    >
      <div className="flex w-full overflow-hidden rounded-[28px] border border-[#cddfed] bg-[linear-gradient(180deg,#e9f6ff_0%,#d7ebfb_52%,#cfe4f3_100%)] shadow-[0_24px_70px_rgba(26,41,66,0.1)] sm:rounded-[36px]">
        <div className="grid flex-1 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:p-8">
          <div className="min-w-0 space-y-6">
            <div className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#007185] shadow-sm">
              Electronics retail marketplace
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-[clamp(3.2rem,9vw,6.8rem)] font-semibold leading-[0.92] tracking-tight text-[#131921]">
                Retail Intelligence Dashboard
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#30475d] sm:text-lg">
                Browse the website like a real storefront, then open the floating chatbot
                anytime for inventory questions, sales analysis, product recommendations,
                charts, and support automation.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onEnterCockpit}
                className="rounded-md bg-[#ff9900] px-6 py-3 text-sm font-semibold text-[#131921] transition hover:bg-[#ffad33]"
              >
                Enter the cockpit
              </button>
              <button
                type="button"
                onClick={onViewSmartAlerts}
                className="rounded-md border border-[#3b5b7a] bg-[#232f3e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#131921]"
              >
                View smart alerts
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {projectCapabilities.map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-[#d4e4f0] bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#007185]">
                    Core feature
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#41576d]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid min-w-0 gap-5">
            <div className="glass-panel rounded-[30px] border border-[#d4e4f0] p-6 text-[#131921] shadow-stage">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#007185]">
                    Store intelligence
                  </p>
                  <h2 className="mt-3 max-w-2xl text-[2.1rem] font-semibold leading-tight text-[#131921]">
                    Marketplace presentation meets actionable AI.
                  </h2>
                </div>
                <div className="rounded-full bg-[#232f3e] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                  Live store
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {retailSections.map((item, index) => (
                  <div
                    key={item}
                    className="flex min-h-[132px] flex-col justify-between rounded-[22px] border border-[#d7e5f0] bg-[#f7fbff] p-4 text-[#131921]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5f6b7a]">
                      Feature {index + 1}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-[#31465b]">{item}</p>
                  </div>
                ))}
              </div>

              {featuredProduct ? (
                <div className="mt-6 rounded-[26px] border border-[#d7e5f0] bg-[linear-gradient(90deg,#f7fbff_0%,#e7f3ff_100%)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#007185]">
                    Hero product
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-3xl font-semibold text-[#131921]">
                        {featuredProduct.name}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-7 text-[#4b6074]">
                        Showcase the electronics scenario clearly while the floating assistant
                        handles recommendations, charts, and customer support.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenProductInsight}
                      className="rounded-md bg-[#232f3e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#131921]"
                    >
                      Open product insight
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
