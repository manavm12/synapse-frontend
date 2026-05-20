"use client";

import { useState } from "react";
import type { KeyMetadata } from "@/lib/types";

interface ApiKeyCardProps {
  apiKey: string;
  keyMeta: KeyMetadata | null;
  onRotate: () => Promise<void>;
}

export function ApiKeyCard({ apiKey, keyMeta, onRotate }: ApiKeyCardProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [rotateError, setRotateError] = useState<string | null>(null);

  const copy = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRotate = async () => {
    if (!confirm("Rotate your API key? The current key will stop working immediately.")) return;
    setRotateError(null);
    setRotating(true);
    try {
      await onRotate();
    } catch (err: unknown) {
      setRotateError(err instanceof Error ? err.message : "Rotation failed");
    } finally {
      setRotating(false);
    }
  };

  return (
    <div className="rounded-lg border border-white/[0.08] p-5" style={{ background: "#1a1a1a" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-light text-white/35">API Key</p>
        {keyMeta?.last_used_at && (
          <p className="text-[10px] text-white/20">
            Last used {new Date(keyMeta.last_used_at).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <code className="flex-1 rounded-md bg-white/[0.04] px-3 py-2 font-mono text-xs text-white/60 truncate">
          {visible ? apiKey : "sk-syn-" + "•".repeat(32)}
        </code>
        <button onClick={() => setVisible((v) => !v)} className="text-xs text-white/30 hover:text-white/60 transition-colors px-2">
          {visible ? "hide" : "show"}
        </button>
        <button onClick={copy} className="text-xs text-white/30 hover:text-white/60 transition-colors px-2">
          {copied ? "copied!" : "copy"}
        </button>
      </div>

      <button
        onClick={handleRotate}
        disabled={rotating}
        className="text-xs text-white/25 hover:text-white/50 transition-colors disabled:opacity-50"
      >
        {rotating ? "Rotating..." : "↻ Rotate key"}
      </button>
      {rotateError && <p className="mt-1 text-xs text-red-400/70">{rotateError}</p>}
    </div>
  );
}
