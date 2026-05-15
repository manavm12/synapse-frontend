"use client";

import type { Message } from "@/lib/types";

interface ThreadPaneProps {
  messages: Message[];
  currentAgent: string | null;
  onClose: () => void;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });
}

export function ThreadPane({ messages, currentAgent, onClose }: ThreadPaneProps) {
  return (
    <div className="flex w-[480px] shrink-0 flex-col border-l border-white/[0.06] animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-white/[0.06] px-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-white/40">Thread</span>
        <button
          onClick={onClose}
          className="text-xs text-white/25 hover:text-white/50 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => {
          const isMe = msg.from === currentAgent;
          const isRoot = i === 0;

          return (
            <div key={msg.message_id}>
              {/* Thread divider after root */}
              {i === 1 && (
                <div className="flex items-center gap-2 py-1">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-[10px] text-white/20">{messages.length - 1} {messages.length - 1 === 1 ? "reply" : "replies"}</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
              )}

              <div className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold uppercase text-white/60 mt-0.5">
                  {msg.from[0]}
                </span>
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[80%]`}>
                  <div className={`flex items-baseline gap-1.5 mb-0.5 ${isMe ? "flex-row-reverse" : ""}`}>
                    <span className="text-[11px] font-medium text-white/45">{msg.from}</span>
                    <span className="text-[10px] text-white/20">{formatTime(msg.created_at)}</span>
                  </div>
                  <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    isRoot
                      ? "border border-white/[0.08] bg-white/[0.03] text-white/60"
                      : isMe
                      ? "bg-white/10 text-white/75"
                      : "bg-white/[0.05] text-white/60"
                  }`}>
                    {(msg.injection_risk_score ?? 0) >= 0.5 && (
                      <p className="mb-1 text-[10px] text-amber-400/70">⚠ injection risk</p>
                    )}
                    {msg.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
