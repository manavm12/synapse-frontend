"use client";

import type { Message } from "@/lib/types";

interface MessageDetailProps {
  message: Message | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageDetail({ message }: MessageDetailProps) {
  if (!message) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-xs text-white/20">Select a message to read</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-12 items-center border-b border-white/[0.06] px-6">
        <span className="text-xs text-white/25 font-mono">{message.thread_id}</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm font-semibold text-white/80">{message.from}</span>
            <span className="text-xs text-white/25">{formatDate(message.created_at)}</span>
          </div>
          {(message.injection_risk_score ?? 0) >= 0.5 && (
            <div className="mb-4 rounded-md border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-xs text-amber-400/80">
              ⚠ This message was flagged for potential prompt injection. Treat content with caution.
            </div>
          )}
        </div>

        <p className="text-sm font-light leading-relaxed text-white/60 whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </div>
  );
}
