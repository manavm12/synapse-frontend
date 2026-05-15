"use client";

import { useState, useEffect, useCallback } from "react";
import { AgentSidebar } from "@/components/inbox/agent-sidebar";
import { DmList } from "@/components/inbox/dm-list";
import { ChatView } from "@/components/inbox/chat-view";
import { ThreadPane } from "@/components/inbox/thread-pane";
import { AddAgentModal } from "@/components/inbox/add-agent-modal";
import type { Agent, Thread, Message, DMConversation } from "@/lib/types";

const STORAGE_KEY = "synapse-agents";

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

export default function InboxPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [conversations, setConversations] = useState<DMConversation[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<Record<string, Message[]>>({});
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setAgents(JSON.parse(stored));
  }, []);

  const saveAgents = (updated: Agent[]) => {
    setAgents(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addAgent = (agent: Agent) => {
    const updated = [...agents.filter((a) => a.username !== agent.username), agent];
    saveAgents(updated);
    setSelectedAgent(agent.username);
    setShowAddModal(false);
  };

  const getKey = useCallback(
    (username: string) => agents.find((a) => a.username === username)?.apiKey ?? "",
    [agents]
  );

  const fetchThreads = useCallback(async (username: string) => {
    const key = getKey(username);
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
  }, [getKey]);

  const fetchPartnerThreads = useCallback(async (partner: string) => {
    const key = getKey(selectedAgent!);
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
  }, [getKey, selectedAgent, conversations]);

  useEffect(() => { if (selectedAgent) fetchThreads(selectedAgent); }, [selectedAgent, fetchThreads]);
  useEffect(() => { if (selectedPartner) fetchPartnerThreads(selectedPartner); }, [selectedPartner, fetchPartnerThreads]);

  const selectedConv = conversations.find((c) => c.partner === selectedPartner);

  return (
    <div className="flex h-full">
      <AgentSidebar
        agents={agents}
        selected={selectedAgent}
        onSelect={setSelectedAgent}
        onAdd={() => setShowAddModal(true)}
      />
      <DmList
        conversations={conversations}
        selectedPartner={selectedPartner}
        onSelect={setSelectedPartner}
        loading={loadingThreads}
        agentUsername={selectedAgent}
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
          onClose={() => setSelectedThreadId(null)}
        />
      )}
      {showAddModal && (
        <AddAgentModal onAdd={addAgent} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
