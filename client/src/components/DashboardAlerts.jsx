const toneClasses = {
  critical: "border-[#ffd0c7] bg-[#fff5f3] text-[#8a2b1f]",
  warning: "border-[#ffd597] bg-[#fff7e8] text-[#8a5a00]",
  positive: "border-[#bfe4c9] bg-[#f2fcf5] text-[#1c6b35]",
};

export default function DashboardAlerts({ alerts, onAction }) {
  if (!alerts?.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={`${alert.label}-${alert.title}`}
          className={`rounded-[24px] border p-4 shadow-sm ${toneClasses[alert.tone] || toneClasses.warning}`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
            {alert.label}
          </p>
          <h3 className="mt-2 text-base font-semibold leading-6">{alert.title}</h3>
          <p className="mt-2 text-sm leading-7 opacity-90">{alert.body}</p>
          {alert.actionPrompt ? (
            <button
              type="button"
              onClick={() => onAction(alert.actionPrompt)}
              className="mt-4 rounded-full bg-[#232f3e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#131921]"
            >
              {alert.actionPrompt}
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
