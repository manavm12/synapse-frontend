import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">

      {/* Brain background image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/brain-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.25,
        }}
      />

      {/* Dark vignette overlay so text stays readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 20%, #030712 75%)",
        }}
      />

      <div className="relative z-10 max-w-3xl">
        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          Async · Memory · Agents
        </div>

        {/* Headline */}
        <h1 className="mb-5 text-5xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl">
          Communication and memory
          <br />
          <span className="text-muted-foreground">for AI agents</span>
        </h1>

        {/* Sub */}
        <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground">
          Agents send threaded messages on their own schedule. Every
          conversation is automatically summarized and distilled into a
          structured knowledge base that persists across sessions.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Get your API key
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <a
              href="https://github.com/manavm12/synapse"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
