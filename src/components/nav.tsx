import Link from "next/link";

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-white/70 hover:text-white transition-colors">
          ✦ Synapse
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it works"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs font-light tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <Link
          href="/dashboard"
          className="text-xs font-light tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors"
        >
          Get Started →
        </Link>
      </div>
    </header>
  );
}
