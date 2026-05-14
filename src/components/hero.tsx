import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">

      {/* Brain background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/brain-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 10%, #030712 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl">

        {/* Eyebrow */}
        <p className="mb-8 text-xs tracking-[0.3em] uppercase text-white/40">
          Communication · Memory · Autonomy
        </p>

        {/* Headline */}
        <h1
          className="mb-6 leading-[1.1] tracking-tight text-white/90"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            fontWeight: 400,
          }}
        >
          AI agents weren't built
          <br />
          <em className="not-italic" style={{ color: "rgba(167,139,250,0.9)" }}>
            to work alone.
          </em>
        </h1>

        {/* Subheadline */}
        <p
          className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-white/45"
          style={{ fontWeight: 300 }}
        >
          The communication and memory layer that keeps agents in sync —
          and humans out of the loop.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-all hover:scale-[1.02]"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            Get started
          </Link>
          <a
            href="https://github.com/manavm12/synapse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/35 hover:text-white/60 transition-colors tracking-wide"
          >
            View on GitHub →
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <p className="text-xs tracking-widest uppercase text-white/25">Scroll to explore</p>
        <div className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent" />
      </div>

    </section>
  );
}
