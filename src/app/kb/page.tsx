"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TopicTree } from "@/components/kb/topic-tree";
import { ClaimsView } from "@/components/kb/claims-view";
import { useAgents } from "@/lib/use-agents";
import type { Topic, Claim } from "@/lib/types";

function KBContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentParam = searchParams.get("agent");
  const { agents, getAgentKey } = useAgents();

  const apiKey = agentParam ? getAgentKey(agentParam) : null;
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(false);

  // Ref tracks the latest requested topic ID so stale responses are discarded
  const activeTopicId = useRef<string | null>(null);

  // Reset all per-agent state immediately when the agent changes to prevent
  // cross-agent data leakage while the new agent's topics are loading
  useEffect(() => {
    setSelectedTopic(null);
    setClaims([]);
    activeTopicId.current = null;
    if (!apiKey) { setLoadingTopics(false); return; }
    setTopics([]);
  }, [agentParam, apiKey]);

  // Fetch topic tree
  useEffect(() => {
    if (!apiKey) return;
    (async () => {
      setLoadingTopics(true);
      try {
        const res = await fetch("/api/synapse/v1/kb/tree", {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (res.status === 401) {
          // Key is revoked/rotated — send to dashboard
          router.push("/dashboard");
          return;
        }
        if (res.ok) setTopics(await res.json());
      } finally {
        setLoadingTopics(false);
      }
    })();
  }, [apiKey, agentParam, router]);

  // Fetch claims — cancels stale in-flight requests via ref guard
  const fetchClaims = useCallback(async (topic: Topic) => {
    if (!apiKey) return;
    activeTopicId.current = topic.id;
    setLoadingClaims(true);
    setClaims([]);
    try {
      const res = await fetch(`/api/synapse/v1/kb/topics/${topic.id}/claims`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      // Discard if a newer topic was selected while this was in flight
      if (activeTopicId.current !== topic.id) return;
      if (res.ok) setClaims(await res.json());
    } finally {
      if (activeTopicId.current === topic.id) setLoadingClaims(false);
    }
  }, [apiKey]);

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    fetchClaims(topic);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar — topic tree */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-white/[0.06]">
        <div className="flex h-12 items-center justify-between border-b border-white/[0.06] px-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-white/40">
            ✦ Knowledge Base
          </span>
        </div>

        {/* Agent switcher */}
        <div className="border-b border-white/[0.06] py-2">
          <p className="px-4 pb-1 pt-1 text-[10px] tracking-widest uppercase text-white/20">Agent</p>
          {agents.map((agent) => (
            <a
              key={agent.username}
              href={`/kb?agent=${agent.username}`}
              className={`flex w-full items-center gap-2 px-4 py-1.5 text-xs transition-colors hover:bg-white/[0.04] ${
                agentParam === agent.username ? "text-white" : "text-white/40"
              }`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] font-semibold uppercase text-white/60">
                {agent.username[0]}
              </span>
              <span className="truncate">{agent.username}</span>
            </a>
          ))}
        </div>

        {/* Topics */}
        <div className="flex-1 overflow-y-auto p-2">
          {loadingTopics && (
            <p className="px-2 py-2 text-xs text-white/25">Loading...</p>
          )}
          {!loadingTopics && !apiKey && (
            <p className="px-2 py-2 text-xs text-white/25">
              Select an agent above
            </p>
          )}
          {!loadingTopics && apiKey && topics.length === 0 && (
            <p className="px-2 py-2 text-xs text-white/25">No topics yet</p>
          )}
          <TopicTree
            topics={topics}
            selectedId={selectedTopic?.id ?? null}
            onSelect={handleSelectTopic}
          />
        </div>

      </aside>

      {/* Main — claims view */}
      <ClaimsView
        topic={selectedTopic}
        claims={claims}
        loading={loadingClaims}
      />
    </div>
  );
}

export default function KBPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><p className="text-xs text-white/25">Loading...</p></div>}>
      <KBContent />
    </Suspense>
  );
}
