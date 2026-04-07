export default function TypingIndicator() {
  return (
    <div className="max-w-md rounded-[28px] border border-[#d9e7ff] bg-white px-4 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2876ff]">
        Retail copilot
      </p>
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#3453ff] [animation-delay:-0.2s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#1789ff] [animation-delay:-0.1s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#13c7ff]" />
        </div>
        <div>
          <p className="text-base font-semibold text-[#1a2942]">Retail copilot is thinking</p>
          <p className="text-sm text-[#7386a4]">
            Reading sales, stock, and merchandising context...
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-[#e0ecff]" />
        <div className="h-3 w-3/4 animate-pulse rounded-full bg-[#e0ecff]" />
        <div className="h-24 animate-pulse rounded-[24px] bg-[#eff6ff]" />
      </div>
    </div>
  );
}
