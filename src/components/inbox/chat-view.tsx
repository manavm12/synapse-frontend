"use client";

import type { Message, Thread } from "@/lib/types";

interface ChatViewProps {
  partner: string | null;
  threads: Thread[];
  threadMessages: Record<string, Message[]>;
  currentAgent: string | null;
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  loading: boolean;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long", month: "short", day: "numeric",
  });
}

export function ChatView({
  partner, threads, threadMessages, currentAgent,
  selectedThreadId, onSelectThread, loading,
}: ChatViewProps) {
  if (!partner) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-xs text-white/20">Select a conversation</p>
      </div>
    );
  }

  // Group threads by date of first message
  const sorted = [...threads].sort((a, b) =>
    new Date(a.last_message?.created_at ?? 0).getTime() -
    new Date(b.last_message?.created_at ?? 0).getTime()
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden border-r border-white/[0.06]">
      {/* Header */}
      <div className="flex h-12 items-center gap-3 border-b border-white/[0.06] px-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold uppercase text-white/60">
          {partner[0]}
        </span>
        <span className="text-sm font-medium text-white/70">{partner}</span>
      </div>

      {/* Thread roots */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {loading && <p className="text-xs text-white/25 text-center py-8">Loading...</p>}
        {!loading && sorted.length === 0 && (
          <p className="text-xs text-white/25 text-center py-8">No messages</p>
        )}

        {sorted.map((thread) => {
          const msgs = threadMessages[thread.thread_id] ?? [];
          const root = msgs[0];
          const replyCount = msgs.length - 1;
          const isSelected = selectedThreadId === thread.thread_id;

          if (!root) return null;
          const isMe = root.from === currentAgent;

          return (
            <div key={thread.thread_id}>
              {/* Root message */}
              <div className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold uppercase text-white/60 mt-0.5">
                  {root.from[0]}
                </span>
                <div className={`max-w-[65%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`flex items-baseline gap-2 mb-1 ${isMe ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs font-medium text-white/50">{root.from}</span>
                    <span className="text-[10px] text-white/25">{formatTime(root.created_at)}</span>
                  </div>
                  <div className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${isMe ? "bg-white/10 text-white/80" : "bg-white/[0.05] text-white/70"}`}>
                    {root.content}
                  </div>

                  {/* Reply count / thread opener */}
                  <button
                    onClick={() => onSelectThread(thread.thread_id)}
                    className={`mt-1.5 text-[11px] transition-colors ${
                      isSelected
                        ? "text-white/60"
                        : "text-white/30 hover:text-white/55"
                    }`}
                  >
                    {replyCount > 0
                      ? `💬 ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`
                      : "💬 Reply"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
