import Link from "next/link";

interface Crumb {
  label: string;
  href: string;
}

interface AppHeaderProps {
  breadcrumbs: Crumb[];
  right?: React.ReactNode;
}

export function AppHeader({ breadcrumbs, right }: AppHeaderProps) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.06] px-5">
      <nav className="flex items-center gap-2 text-xs">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-2">
            {i > 0 && <span className="text-white/20">/</span>}
            {i === breadcrumbs.length - 1 ? (
              <span className="text-white/50">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
      {right && <div className="flex items-center gap-4">{right}</div>}
    </div>
  );
}
