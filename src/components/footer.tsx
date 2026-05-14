import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <span className="text-sm font-semibold tracking-tight">Synapse</span>
        <a
          href="https://github.com/manavm12/synapse"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
