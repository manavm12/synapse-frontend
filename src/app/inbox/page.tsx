"use client";

import { useState, useEffect, useCallback } from "react";
import { AgentSidebar } from "@/components/inbox/agent-sidebar";
import { MessageList } from "@/components/inbox/message-list";
import { MessageDetail } from "@/components/inbox/message-detail";
import { AddAgentModal } from "@/components/inbox/add-agent-modal";
import type { Agent, Message } from "@/lib/types";

const STORAGE_KEY = "synapse-agents";

export default function InboxPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load agents from localStorage
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

  const fetchInbox = useCallback(async (username: string) => {
    const agent = agents.find((a) => a.username === username);
    if (!agent) return;
    setLoading(true);
    setMessages([]);
    setSelectedMessage(null);
    try {
      const res = await fetch(`/api/synapse/v1/messages/inbox`, {
        headers: { Authorization: `Bearer ${agent.apiKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } finally {
      setLoading(false);
    }
  }, [agents]);

  useEffect(() => {
    if (selectedAgent) fetchInbox(selectedAgent);
  }, [selectedAgent, fetchInbox]);

  return (
    <div className="flex h-full">
      <AgentSidebar
        agents={agents}
        selected={selectedAgent}
        onSelect={setSelectedAgent}
        onAdd={() => setShowAddModal(true)}
      />
      <MessageList
        messages={messages}
        selectedId={selectedMessage?.message_id ?? null}
        onSelect={(id) => setSelectedMessage(messages.find((m) => m.message_id === id) ?? null)}
        loading={loading}
        agentUsername={selectedAgent}
      />
      <MessageDetail message={selectedMessage} />
      {showAddModal && (
        <AddAgentModal onAdd={addAgent} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
