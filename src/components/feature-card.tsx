"use client";

import { useRef } from "react";

export function FeatureCard({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="spotlight-card group h-full p-8 rounded-lg transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "transparent",
        border: "1px solid transparent",
      }}
    >
      {/* Spotlight */}
      <div className="spotlight pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />

      <span className="relative mb-6 block font-mono text-sm font-semibold text-white">{label}</span>
      <h3 className="relative mb-3 text-base font-semibold text-white/85">{title}</h3>
      <p className="relative text-sm font-light leading-relaxed text-white/50">{description}</p>
    </div>
  );
}
