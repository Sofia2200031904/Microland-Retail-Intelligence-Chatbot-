export default function ForecastCard({ forecast, onAction, className = "" }) {
  if (!forecast) {
    return null;
  }

  return (
    <div
      className={`flex min-h-[220px] flex-col gap-4 rounded-[26px] bg-[linear-gradient(135deg,#131921_0%,#232f3e_100%)] p-6 text-white shadow-stage sm:p-6 ${className}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb84d]">
        {forecast.label}
      </p>
      <h3 className="max-w-[14ch] font-display text-[clamp(2rem,3vw,2.9rem)] font-semibold leading-[1.02]">
        {forecast.title}
      </h3>
      <p className="max-w-[56ch] text-sm leading-7 text-white/72">{forecast.body}</p>
      <button
        type="button"
        onClick={() => onAction(forecast.actionPrompt)}
        className="mt-auto self-start rounded-full border border-white/15 bg-[#ff9900] px-5 py-3 text-sm font-semibold text-[#131921] transition hover:bg-[#ffad33]"
      >
        {forecast.actionPrompt}
      </button>
    </div>
  );
}
