import Link from "next/link";

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-white/80 hover:text-white transition-colors"
        >
          <span className="text-base">✦</span>
          Synapse
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it works"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-white/50 hover:text-white/90 transition-colors tracking-wide"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="text-sm text-white/70 hover:text-white transition-colors tracking-wide"
        >
          Get Started →
        </Link>
      </div>
    </header>
  );
}
