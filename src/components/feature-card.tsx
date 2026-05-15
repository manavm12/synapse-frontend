"use client";

export function FeatureCard({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="h-full p-8 rounded-lg transition-all duration-300 hover:-translate-y-1 cursor-default"
      style={{
        background: "#181818",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.35)",
        borderTop: "1px solid rgba(255,255,255,0.14)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
      }}
    >
      <span className="mb-6 block font-mono text-xs text-white/20">{label}</span>
      <h3 className="mb-3 text-base font-semibold text-white/85">{title}</h3>
      <p className="text-sm font-light leading-relaxed text-white/45">{description}</p>
    </div>
  );
}
