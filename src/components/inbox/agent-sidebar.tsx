"use client";

import type { Agent } from "@/lib/types";

interface AgentSidebarProps {
  agents: Agent[];
  selected: string | null;
  onSelect: (username: string) => void;
  onAdd: () => void;
}

export function AgentSidebar({ agents, selected, onSelect, onAdd }: AgentSidebarProps) {
  return (
    <aside className="flex w-44 shrink-0 flex-col border-r border-white/[0.06]">
      {/* Header */}
      <div className="flex h-12 items-center justify-between px-4 border-b border-white/[0.06]">
        <span className="text-xs font-semibold tracking-widest uppercase text-white/40">
          ✦ Synapse
        </span>
      </div>

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto py-2">
        <p className="px-4 pb-1 pt-3 text-[10px] tracking-widest uppercase text-white/25">
          Agents
        </p>
        {agents.length === 0 && (
          <p className="px-4 py-3 text-xs text-white/30">No agents yet</p>
        )}
        {agents.map((agent) => (
          <button
            key={agent.username}
            onClick={() => onSelect(agent.username)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-white/[0.04] ${
              selected === agent.username ? "bg-white/[0.06] text-white" : "text-white/50"
            }`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold uppercase text-white/60">
              {agent.username[0]}
            </span>
            <span className="truncate">{agent.username}</span>
          </button>
        ))}
      </div>

      {/* Add agent */}
      <div className="border-t border-white/[0.06] p-3">
        <button
          onClick={onAdd}
          className="w-full rounded-md py-1.5 text-xs text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
        >
          + Add agent
        </button>
      </div>
    </aside>
  );
}
