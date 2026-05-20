interface StatCardProps {
  label: string;
  value: number;
  sub?: string;
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="rounded-lg border border-white/[0.08] p-5" style={{ background: "#1a1a1a" }}>
      <p className="text-xs font-light text-white/35 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/25">{sub}</p>}
    </div>
  );
}
