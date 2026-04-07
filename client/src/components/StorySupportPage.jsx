const trackedOrder = {
  id: "ORD-1002",
  item: "Noise-Canceling Headphones",
  status: "In transit",
  eta: "Expected today, 6:30 PM",
  channel: "Marketplace",
  destination: "Bengaluru",
};

const orderMilestones = [
  {
    title: "Order placed",
    detail: "Payment confirmed and support context saved.",
    state: "complete",
  },
  {
    title: "Packed for dispatch",
    detail: "Warehouse handoff completed successfully.",
    state: "complete",
  },
  {
    title: "In transit",
    detail: "Customer can track the package and ask support follow-ups.",
    state: "active",
  },
  {
    title: "Delivered",
    detail: "Return and cancellation help stay available after delivery.",
    state: "upcoming",
  },
];

export default function StorySupportPage({
  retailSections,
  onBack,
  onTrackOrder,
  onReturnPolicy,
  showBackButton = true,
  isStacked = false,
}) {
  return (
    <section
      className={`mx-auto w-full max-w-7xl text-[#131921] ${
        isStacked ? "" : "flex min-h-full flex-1"
      }`}
    >
      <div className="flex w-full overflow-hidden rounded-[28px] border border-[#d7e7ff] bg-[linear-gradient(180deg,#eef7ff_0%,#dff0ff_48%,#d7ebfb_100%)] shadow-[0_24px_60px_rgba(26,41,66,0.1)] sm:rounded-[36px]">
        <div className="flex flex-1 p-3 sm:p-5 xl:p-6">
          <div className="flex min-w-0 flex-1 flex-col rounded-[28px] border border-[#d7e7ff] bg-white/95 p-4 shadow-[0_18px_42px_rgba(26,41,66,0.08)] sm:rounded-[32px] sm:p-6 lg:p-7">
            <div className="flex flex-col gap-4 border-b border-[#e4edf7] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <p className="inline-flex rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
                  Support operations
                </p>
                <h2 className="mt-3 text-[clamp(2.4rem,5vw,4.9rem)] font-semibold leading-[0.94] tracking-tight text-[#131921]">
                  Order tracking stays visible inside the page.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f6b7a] sm:text-[15px]">
                  This view keeps the customer-support story full size like a real
                  dashboard section, with order tracking, status steps, and help
                  actions visible on the same screen.
                </p>
              </div>

              {showBackButton ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full rounded-xl border border-[#cfe1ff] bg-white px-5 py-3 text-sm font-semibold text-[#216bff] shadow-[0_10px_24px_rgba(33,107,255,0.08)] transition hover:bg-[#eef6ff] sm:w-auto"
                >
                  Back to dashboard
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
              <div className="min-w-0 rounded-[28px] border border-[#dce9ff] bg-[linear-gradient(180deg,#f8fbff_0%,#edf6ff_100%)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
                  Track order support
                </p>
                <h3 className="mt-3 text-[clamp(1.9rem,3.2vw,3.1rem)] font-semibold leading-[1.02] text-[#131921]">
                  Track the order without opening a tiny support box.
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#5f6b7a] sm:text-[15px]">
                  Order status, customer-service actions, and the retail story now stay
                  in one presentation-ready layout that feels closer to a professional
                  operations dashboard.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onTrackOrder}
                    className="rounded-xl bg-[#216bff] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(33,107,255,0.18)] transition hover:bg-[#1b5fe6]"
                  >
                    Track this order
                  </button>
                  <button
                    type="button"
                    onClick={onReturnPolicy}
                    className="rounded-xl border border-[#cfe1ff] bg-white px-5 py-3 text-sm font-semibold text-[#216bff] transition hover:bg-[#f5faff]"
                  >
                    Return policy help
                  </button>
                </div>
              </div>

              <div className="min-w-0 rounded-[28px] border border-[#dce9ff] bg-[linear-gradient(180deg,#f8fbff_0%,#edf6ff_100%)] p-5 text-[#131921] shadow-[0_18px_42px_rgba(26,41,66,0.08)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
                      Live tracked order
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold">{trackedOrder.id}</h3>
                  </div>
                  <span className="rounded-full bg-[#eaf7ef] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f8f4d]">
                    {trackedOrder.status}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#5f6b7a]">
                  {trackedOrder.item} is moving through the {trackedOrder.channel.toLowerCase()}{" "}
                  channel and can be monitored without leaving this page.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-[#d7e7ff] bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6a7a90]">
                      ETA
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#131921]">{trackedOrder.eta}</p>
                  </div>
                  <div className="rounded-[22px] border border-[#d7e7ff] bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6a7a90]">
                      Destination
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#131921]">{trackedOrder.destination}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(260px,0.92fr)]">
              <div className="min-w-0 rounded-[28px] border border-[#dce9ff] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
                      Order timeline
                    </p>
                    <h3 className="mt-2 text-[1.9rem] font-semibold leading-tight text-[#131921]">
                      Customer support can follow every delivery step.
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#216bff]">
                    Always visible
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  {orderMilestones.map((step) => (
                    <div
                      key={step.title}
                      className={`rounded-[22px] border px-4 py-4 ${
                        step.state === "complete"
                          ? "border-[#cfe1ff] bg-[#f8fbff]"
                          : step.state === "active"
                            ? "border-[#216bff] bg-[#eef5ff]"
                            : "border-[#e3eaf4] bg-[#fafcff]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#131921]">{step.title}</p>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                            step.state === "complete"
                              ? "bg-[#eaf7ef] text-[#1f8f4d]"
                              : step.state === "active"
                                ? "bg-[#dfeaff] text-[#216bff]"
                                : "bg-[#eef1f5] text-[#6d7c90]"
                          }`}
                        >
                          {step.state === "complete"
                            ? "Complete"
                            : step.state === "active"
                              ? "Current"
                              : "Next"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#5f6b7a]">{step.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0 rounded-[28px] border border-[#dce9ff] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
                  Retail story
                </p>
                <h3 className="mt-2 text-[1.8rem] font-semibold leading-tight text-[#131921]">
                  One scenario, one clean story, one visible support flow.
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#5f6b7a] sm:text-[15px]">
                  The ecommerce experience stays easy to present while the assistant
                  covers order tracking, shipping questions, and returns in the same
                  layout.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {retailSections.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#cfe1ff] bg-white px-4 py-2 text-[11px] font-medium uppercase leading-5 tracking-[0.18em] text-[#216bff] sm:text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
