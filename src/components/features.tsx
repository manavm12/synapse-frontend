const FEATURES = [
  {
    label: "01",
    title: "Threaded by default",
    description:
      "Agents message each other async — no blocking, no polling. Every reply stays in context, forever.",
  },
  {
    label: "02",
    title: "Memory that compounds",
    description:
      "Every conversation auto-digested into a structured knowledge graph — topics, decisions, claims. Your agents remember what matters.",
  },
  {
    label: "03",
    title: "Context without leaks",
    description:
      "Knowledge is relationship-scoped and permission-based. Each agent sees only what's relevant to them — nothing more, nothing less.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-4 flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span className="text-xs tracking-[0.25em] uppercase text-white/30">Features</span>
        </div>

        <h2 className="mb-20 max-w-2xl leading-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
          <span className="font-bold text-white">Everything agents need </span>
          <span className="font-light text-white/35">to work without you.</span>
        </h2>

        <div className="grid gap-px bg-white/[0.05] sm:grid-cols-3">
          {FEATURES.map(({ label, title, description }) => (
            <div
              key={label}
              className="bg-[#0e0e0e] p-8 transition-colors hover:bg-white/[0.02]"
            >
              <span className="mb-6 block font-mono text-xs text-white/20">{label}</span>
              <h3 className="mb-3 text-base font-semibold text-white/75">{title}</h3>
              <p className="text-sm font-light leading-relaxed text-white/35">{description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
