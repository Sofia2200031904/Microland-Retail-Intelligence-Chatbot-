function ExpandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 10V6.5C6 5.67157 6.67157 5 7.5 5H17.5C18.3284 5 19 5.67157 19 6.5V16.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 19H6.5C5.67157 19 5 18.3284 5 17.5V9.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 10.5H9V15"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5L9 15"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="14.25"
        y="14.25"
        width="4.75"
        height="4.75"
        rx="0.6"
        stroke="currentColor"
        strokeWidth="1.9"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ChatHeader({ onClose, onExpand, isExpanded = false }) {
  return (
    <div className="relative bg-gradient-to-r from-[#3453ff] via-[#1789ff] to-[#13c7ff] px-5 py-4 text-white sm:px-6">
      <div className="pr-24">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-[15px] font-semibold shadow-lg ring-2 ring-white/40">
            AI
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              Chat with
            </p>
            <h1 className="mt-1 text-[2rem] font-semibold leading-[0.92] tracking-[-0.02em] sm:text-[2.15rem]">
              <span className="block">Electronics</span>
              <span className="block whitespace-nowrap">Retail Copilot</span>
            </h1>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/16 px-3 py-1 text-sm font-semibold text-white">
              <span className="h-2.5 w-2.5 rounded-full bg-[#8dffb2]" />
              Online
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-5 top-4 flex items-center gap-2 sm:right-6">
        <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        {onExpand ? (
          <button
            type="button"
            onClick={onExpand}
            aria-label={isExpanded ? "Exit full screen chat" : "Expand chat"}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
          >
            <ExpandIcon />
          </button>
        ) : null}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
