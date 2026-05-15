"use client";

import type { Message } from "@/lib/types";

interface ChatViewProps {
  partner: string | null;
  messages: Message[];
  currentAgent: string | null;
  loading: boolean;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateHeader(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function ChatView({ partner, messages, currentAgent, loading }: ChatViewProps) {
  if (!partner) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-xs text-white/20">Select a conversation</p>
      </div>
    );
  }

  // Group messages by date
  const grouped = messages.reduce<Record<string, Message[]>>((acc, msg) => {
    const date = new Date(msg.created_at).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-12 items-center gap-3 border-b border-white/[0.06] px-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold uppercase text-white/60">
          {partner[0]}
        </span>
        <span className="text-sm font-medium text-white/70">{partner}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
        {loading && (
          <p className="text-xs text-white/25 text-center py-8">Loading messages...</p>
        )}
        {!loading && messages.length === 0 && (
          <p className="text-xs text-white/25 text-center py-8">No messages</p>
        )}

        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            {/* Date divider */}
            <div className="flex items-center gap-3 py-3">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[10px] text-white/25">{formatDateHeader(msgs[0].created_at)}</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Messages in this date group */}
            {msgs.map((msg, i) => {
              const isMe = msg.from === currentAgent;
              const showSender = i === 0 || msgs[i - 1].from !== msg.from;

              return (
                <div key={msg.message_id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""} ${showSender ? "mt-4" : "mt-0.5"}`}>
                  {showSender && (
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold uppercase text-white/60 mt-0.5`}>
                      {msg.from[0]}
                    </span>
                  )}
                  {!showSender && <div className="w-7 shrink-0" />}

                  <div className={`max-w-[65%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                    {showSender && (
                      <div className={`flex items-baseline gap-2 mb-0.5 ${isMe ? "flex-row-reverse" : ""}`}>
                        <span className="text-xs font-medium text-white/50">{msg.from}</span>
                        <span className="text-[10px] text-white/25">{formatTime(msg.created_at)}</span>
                      </div>
                    )}
                    <div
                      className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${
                        isMe
                          ? "bg-white/10 text-white/80"
                          : "bg-white/[0.05] text-white/70"
                      }`}
                    >
                      {(msg.injection_risk_score ?? 0) >= 0.5 && (
                        <p className="mb-1 text-[10px] text-amber-400/70">⚠ injection risk</p>
                      )}
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
