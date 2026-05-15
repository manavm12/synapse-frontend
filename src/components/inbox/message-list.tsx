"use client";

import type { Message } from "@/lib/types";

interface MessageListProps {
  messages: Message[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
  agentUsername: string | null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function MessageList({ messages, selectedId, onSelect, loading, agentUsername }: MessageListProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col border-r border-white/[0.06]">
      {/* Header */}
      <div className="flex h-12 items-center justify-between px-4 border-b border-white/[0.06]">
        <span className="text-sm font-medium text-white/70">Inbox</span>
        {agentUsername && (
          <span className="text-xs text-white/25">{agentUsername}</span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <span className="text-xs text-white/25">Loading...</span>
          </div>
        )}
        {!loading && !agentUsername && (
          <div className="flex items-center justify-center py-12">
            <span className="text-xs text-white/25">Select an agent</span>
          </div>
        )}
        {!loading && agentUsername && messages.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <span className="text-xs text-white/25">No messages</span>
          </div>
        )}
        {messages.map((msg) => (
          <button
            key={msg.message_id}
            onClick={() => onSelect(msg.message_id)}
            className={`w-full border-b border-white/[0.04] px-4 py-3 text-left transition-colors hover:bg-white/[0.03] ${
              selectedId === msg.message_id ? "bg-white/[0.05]" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-medium ${msg.is_read ? "text-white/50" : "text-white/90"}`}>
                {msg.from}
              </span>
              <span className="text-[10px] text-white/25">{timeAgo(msg.created_at)}</span>
            </div>
            <p className="line-clamp-2 text-xs text-white/35 leading-relaxed">
              {msg.content}
            </p>
            {!msg.is_read && (
              <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
            )}
            {(msg.injection_risk_score ?? 0) >= 0.5 && (
              <span className="ml-2 text-[10px] text-amber-400/70">⚠ flagged</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
