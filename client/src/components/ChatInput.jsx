import { useEffect, useState } from "react";
import { useVoiceInput } from "../hooks/useVoiceInput";

function VoiceVisualizer() {
  return (
    <div className="flex items-end gap-1">
      <span className="h-3 w-1 animate-pulse rounded-full bg-[#0b7bff]" />
      <span className="h-5 w-1 animate-pulse rounded-full bg-[#0b7bff] [animation-delay:-0.15s]" />
      <span className="h-4 w-1 animate-pulse rounded-full bg-[#0b7bff] [animation-delay:-0.3s]" />
    </div>
  );
}

export default function ChatInput({ onSend, isLoading }) {
  const [input, setInput] = useState("");
  const {
    isSupported,
    isListening,
    error,
    liveTranscript,
    startListening,
    stopListening,
    clearTranscript,
  } = useVoiceInput({
    onFinalTranscript: (transcript) => {
      const finalMessage = transcript.trim();
      if (!finalMessage) {
        return;
      }

      setInput(finalMessage);

      if (!isLoading) {
        onSend(finalMessage);
        setInput("");
        setTimeout(() => clearTranscript(), 400);
      }
    },
  });

  useEffect(() => {
    if (isListening && liveTranscript) {
      setInput(liveTranscript);
    }
  }, [isListening, liveTranscript]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim() || isLoading) {
      return;
    }

    onSend(input.trim());
    setInput("");
    clearTranscript();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 border-t border-[#d7e6ff] bg-white/95 p-4 backdrop-blur"
    >
      <div className="rounded-[30px] border border-[#d9e7ff] bg-white p-4 shadow-[0_20px_45px_rgba(37,87,214,0.12)]">
        {isListening || liveTranscript ? (
          <div className="mb-3 rounded-[20px] border border-[#cfe1ff] bg-[#f4f9ff] px-3 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#246dff]">
              <VoiceVisualizer />
              Live voice transcript
            </div>
            <p className="mt-2 text-base text-[#41516b]">
              {liveTranscript || "Listening for your question..."}
            </p>
          </div>
        ) : null}

        <div className="flex items-end gap-3">
          <div className="flex-1 rounded-[24px] border border-[#d9e7ff] bg-[#f9fbff] px-4 py-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  handleSubmit(event);
                }
              }}
              rows={2}
              placeholder="Enter your message..."
              className="w-full resize-none border-none bg-transparent text-[15px] leading-8 text-[#22324c] outline-none placeholder:text-[#9aabc4] md:text-base"
            />

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#7c8cab]">
                <span>{isLoading ? "Retail copilot is typing..." : "Press Enter to send"}</span>
                {error ? <span className="text-[#d14d4d]">{error}</span> : null}
              </div>

              <div className="rounded-full bg-[#eef5ff] px-3 py-1 font-semibold uppercase tracking-[0.16em] text-[#2876ff]">
                {isListening ? "Listening" : "Voice ready"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported}
            className={`rounded-full border px-4 py-3 text-[15px] font-semibold transition ${
              isListening
                ? "border-[#8dc4ff] bg-[#eaf4ff] text-[#1768ff]"
                : "border-[#d9e7ff] bg-white text-[#4a6387]"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isListening ? "Stop" : "Voice"}
          </button>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#3453ff] via-[#1789ff] to-[#13c7ff] text-sm font-semibold text-white shadow-[0_14px_30px_rgba(23,137,255,0.35)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L13 6M19 12L13 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
