import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight">Synapse</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Button asChild size="sm">
            <Link href="/dashboard">Get API key</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
