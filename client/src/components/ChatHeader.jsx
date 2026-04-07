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
    <div className="bg-gradient-to-r from-[#3453ff] via-[#1789ff] to-[#13c7ff] px-6 py-5 text-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-base font-semibold shadow-lg ring-2 ring-white/40">
            AI
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              Chat with
            </p>
            <h1 className="mt-1 text-2xl font-semibold md:text-[1.9rem]">
              Electronics Retail Copilot
            </h1>
            <p className="mt-1 text-base text-white/85">
              We are online. Ask about inventory, sales, products, or order help.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
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
    </div>
  );
}
