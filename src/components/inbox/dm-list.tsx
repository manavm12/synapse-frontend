"use client";

import type { DMConversation } from "@/lib/types";

interface DmListProps {
  conversations: DMConversation[];
  selectedPartner: string | null;
  onSelect: (partner: string) => void;
  loading: boolean;
  agentUsername: string | null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function DmList({ conversations, selectedPartner, onSelect, loading, agentUsername }: DmListProps) {
  return (
    <div className="flex w-64 shrink-0 flex-col border-r border-white/[0.06]">
      <div className="flex h-12 items-center px-4 border-b border-white/[0.06]">
        <span className="text-xs font-semibold tracking-widest uppercase text-white/40">
          Direct Messages
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {loading && (
          <p className="px-4 py-3 text-xs text-white/25">Loading...</p>
        )}
        {!loading && !agentUsername && (
          <p className="px-4 py-3 text-xs text-white/25">Select an agent</p>
        )}
        {!loading && agentUsername && conversations.length === 0 && (
          <p className="px-4 py-3 text-xs text-white/25">No conversations yet</p>
        )}
        {conversations.map((conv) => (
          <button
            key={conv.partner}
            onClick={() => onSelect(conv.partner)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.04] ${
              selectedPartner === conv.partner ? "bg-white/[0.06]" : ""
            }`}
          >
            {/* Avatar */}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold uppercase text-white/60">
              {conv.partner[0]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-sm truncate ${selectedPartner === conv.partner ? "text-white" : "text-white/60"}`}>
                  {conv.partner}
                </span>
                <span className="ml-2 shrink-0 text-[10px] text-white/25">
                  {timeAgo(conv.lastActivity)}
                </span>
              </div>
              {conv.threads[0]?.last_message && (
                <p className="truncate text-xs text-white/25">
                  {conv.threads[0].last_message.content}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
