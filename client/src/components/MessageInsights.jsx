const toneClasses = {
  critical: "border-[#ffd8d2] bg-[#fff6f4]",
  warning: "border-[#ffe2a8] bg-[#fff9ef]",
  positive: "border-[#d8f1df] bg-[#f5fff8]",
};

export default function MessageInsights({ insights, actions, prediction, alert, onAction }) {
  if (!insights?.length && !prediction && !alert && !actions?.length) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      {alert ? (
        <div
          className={`rounded-[24px] border p-4 ${toneClasses[alert.level] || toneClasses.warning}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5f7293]">
            Smart alert
          </p>
          <h4 className="mt-2 text-base font-semibold text-[#1a2942]">{alert.title}</h4>
          <p className="mt-2 text-[15px] leading-7 text-[#53627c]">{alert.body}</p>
        </div>
      ) : null}

      {prediction ? (
        <div className="rounded-[24px] border border-[#d7e7ff] bg-[#f5faff] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
            {prediction.title}
          </p>
          <p className="mt-2 text-[15px] leading-7 text-[#53627c]">{prediction.body}</p>
          <p className="mt-2 text-sm text-[#7689a7]">
            Confidence: {prediction.confidence}
          </p>
        </div>
      ) : null}

      {!!insights?.length && (
        <div className="rounded-[24px] border border-[#d7e7ff] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
            AI insights
          </p>
          <div className="mt-3 space-y-3">
            {insights.map((insight) => (
              <div key={insight.title}>
                <h4 className="text-base font-semibold text-[#1a2942]">{insight.title}</h4>
                <p className="mt-1 text-[15px] leading-7 text-[#53627c]">{insight.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!!actions?.length && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => onAction(action)}
              className="rounded-full border border-[#2b7cff] bg-white px-4 py-2 text-[15px] font-semibold text-[#216bff] transition hover:bg-[#eef5ff]"
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
