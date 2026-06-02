"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DmList } from "@/components/inbox/dm-list";
import { ChatView } from "@/components/inbox/chat-view";
import { ThreadPane } from "@/components/inbox/thread-pane";
import { AddAgentModal } from "@/components/inbox/add-agent-modal";
import { ComposeModal } from "@/components/inbox/compose-modal";
import { useAgents } from "@/lib/use-agents";
import type { Thread, Message, DMConversation } from "@/lib/types";

function groupThreadsByPartner(threads: Thread[], currentAgent: string): DMConversation[] {
  const map = new Map<string, Thread[]>();
  for (const thread of threads) {
    const partner = thread.participants.find((p) => p !== currentAgent) ?? "unknown";
    if (!map.has(partner)) map.set(partner, []);
    map.get(partner)!.push(thread);
  }
  return Array.from(map.entries())
    .map(([partner, threadList]) => ({
      partner,
      threads: threadList,
      lastActivity: threadList[0]?.last_message?.created_at ?? "",
    }))
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
}

function InboxContent() {
  const searchParams = useSearchParams();
  const agentParam = searchParams.get("agent");
  const { agents, addAgent, getAgentKey } = useAgents();

  const [selectedAgent, setSelectedAgent] = useState<string | null>(agentParam);
  const [conversations, setConversations] = useState<DMConversation[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<Record<string, Message[]>>({});
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const activeTopicId = useRef<string | null>(null);

  // Sync agent from URL param
  useEffect(() => {
    if (agentParam) setSelectedAgent(agentParam);
  }, [agentParam]);

  const fetchThreads = useCallback(async (username: string) => {
    const key = getAgentKey(username);
    if (!key) return;
    setLoadingThreads(true);
    setConversations([]);
    setSelectedPartner(null);
    setThreadMessages({});
    setSelectedThreadId(null);
    try {
      const res = await fetch("/api/synapse/v1/threads", {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (res.ok) {
        const data: Thread[] = await res.json();
        setConversations(groupThreadsByPartner(data, username));
      }
    } finally {
      setLoadingThreads(false);
    }
  }, [getAgentKey]);

  const fetchPartnerThreads = useCallback(async (partner: string) => {
    if (!selectedAgent) return;
    const key = getAgentKey(selectedAgent);
    if (!key) return;
    const conv = conversations.find((c) => c.partner === partner);
    if (!conv) return;
    setThreadMessages({});
    setSelectedThreadId(null);

    const result: Record<string, Message[]> = {};
    for (const thread of conv.threads) {
      const res = await fetch(`/api/synapse/v1/threads/${thread.thread_id}`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (res.ok) result[thread.thread_id] = await res.json();
    }
    setThreadMessages(result);
  }, [getAgentKey, selectedAgent, conversations]);

  useEffect(() => { if (selectedAgent) fetchThreads(selectedAgent); }, [selectedAgent, fetchThreads]);
  useEffect(() => { if (selectedPartner) fetchPartnerThreads(selectedPartner); }, [selectedPartner, fetchPartnerThreads]);

  const selectedConv = conversations.find((c) => c.partner === selectedPartner);

  return (
    <div className="flex h-full">
      {/* Narrow agent indicator + back link */}
      <aside className="flex w-40 shrink-0 flex-col border-r border-white/[0.06]">
        <div className="flex h-12 items-center px-4 border-b border-white/[0.06]">
          <span className="text-xs font-semibold tracking-widest uppercase text-white/40">✦ Synapse</span>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <p className="px-4 pb-1 pt-3 text-[10px] tracking-widest uppercase text-white/20">Agent</p>
          {agents.map((agent) => (
            <a
              key={agent.username}
              href={`/inbox?agent=${agent.username}`}
              className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-white/[0.04] ${
                selectedAgent === agent.username ? "text-white" : "text-white/40"
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold uppercase text-white/60">
                {agent.username[0]}
              </span>
              <span className="truncate text-xs">{agent.username}</span>
            </a>
          ))}
        </div>
      </aside>

      <DmList
        conversations={conversations}
        selectedPartner={selectedPartner}
        onSelect={setSelectedPartner}
        loading={loadingThreads}
        agentUsername={selectedAgent}
        onCompose={selectedAgent && getAgentKey(selectedAgent) ? () => setShowCompose(true) : undefined}
      />
      <ChatView
        partner={selectedPartner}
        threads={selectedConv?.threads ?? []}
        threadMessages={threadMessages}
        currentAgent={selectedAgent}
        selectedThreadId={selectedThreadId}
        onSelectThread={setSelectedThreadId}
        loading={loadingThreads}
      />
      {selectedThreadId && threadMessages[selectedThreadId] && (
        <ThreadPane
          messages={threadMessages[selectedThreadId]}
          currentAgent={selectedAgent}
          apiKey={selectedAgent ? getAgentKey(selectedAgent) : null}
          threadId={selectedThreadId}
          onClose={() => setSelectedThreadId(null)}
          onReplied={() => selectedPartner && fetchPartnerThreads(selectedPartner)}
        />
      )}
      {showAddModal && (
        <AddAgentModal
          onAdd={(agent) => { addAgent(agent); setShowAddModal(false); }}
          onClose={() => setShowAddModal(false)}
        />
      )}
      {showCompose && selectedAgent && getAgentKey(selectedAgent) && (
        <ComposeModal
          fromUsername={selectedAgent}
          apiKey={getAgentKey(selectedAgent)!}
          defaultTo={selectedPartner ?? undefined}
          onSent={() => {
            setShowCompose(false);
            fetchThreads(selectedAgent);
          }}
          onClose={() => setShowCompose(false)}
        />
      )}
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><p className="text-xs text-white/25">Loading...</p></div>}>
      <InboxContent />
    </Suspense>
  );
}
