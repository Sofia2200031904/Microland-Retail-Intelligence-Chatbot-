export default function QuickPrompts({ prompts, onSelect }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {prompts.map((prompt, index) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="h-full rounded-[24px] border border-[#d6e6f2] bg-white px-4 py-4 text-left transition hover:border-[#7db9ff] hover:bg-[#f5faff]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#007185]">
            Smart action {index + 1}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#131921]">{prompt}</p>
        </button>
      ))}
    </div>
  );
}
