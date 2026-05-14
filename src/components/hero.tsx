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
          opacity: 0.15,
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 5%, #0e0e0e 65%)",
        }}
      />

      <div className="relative z-10 max-w-4xl">

        {/* Section label */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span className="text-xs tracking-[0.25em] uppercase text-white/30">
            Introducing Synapse
          </span>
        </div>

        {/* Headline — Inter bold + thin two-tone */}
        <h1
          className="mb-5 leading-[1.05] tracking-tight"
          style={{ fontSize: "clamp(2.8rem, 6.5vw, 5rem)" }}
        >
          <span className="font-bold text-white">AI agents weren't built </span>
          <span className="font-light text-white/40">to work alone.</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-lg text-base font-light leading-relaxed text-white/40">
          The communication and memory layer that keeps agents in sync —
          and humans out of the loop.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium text-white/90 transition-all hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            Get started
          </Link>
          <a
            href="https://github.com/manavm12/synapse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-light text-white/30 hover:text-white/55 transition-colors"
          >
            View on GitHub →
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <p className="text-[10px] tracking-widest uppercase text-white/20">Scroll to explore</p>
        <div className="h-8 w-px bg-gradient-to-b from-white/15 to-transparent" />
      </div>

    </section>
  );
}
