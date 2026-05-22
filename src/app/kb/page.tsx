"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { TopicTree } from "@/components/kb/topic-tree";
import { ClaimsView } from "@/components/kb/claims-view";
import type { Topic, Claim } from "@/lib/types";

const AGENT_KEY = "synapse-agent-key";

export default function KBPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(false);

  // Load API key from localStorage
  useEffect(() => {
    const key = localStorage.getItem(AGENT_KEY);
    if (key) setApiKey(key);
    else setLoadingTopics(false);
  }, []);

  // Fetch topic tree
  useEffect(() => {
    if (!apiKey) return;
    (async () => {
      setLoadingTopics(true);
      try {
        const res = await fetch("/api/synapse/v1/kb/tree", {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (res.ok) setTopics(await res.json());
      } finally {
        setLoadingTopics(false);
      }
    })();
  }, [apiKey]);

  // Fetch claims for selected topic
  const fetchClaims = useCallback(async (topic: Topic) => {
    if (!apiKey) return;
    setLoadingClaims(true);
    setClaims([]);
    try {
      const res = await fetch(`/api/synapse/v1/kb/topics/${topic.id}/claims`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) setClaims(await res.json());
    } finally {
      setLoadingClaims(false);
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

        <div className="flex-1 overflow-y-auto p-2">
          {loadingTopics && (
            <p className="px-2 py-2 text-xs text-white/25">Loading...</p>
          )}
          {!loadingTopics && !apiKey && (
            <p className="px-2 py-2 text-xs text-white/25">
              No API key —{" "}
              <Link href="/dashboard" className="underline hover:text-white/50">
                go to dashboard
              </Link>
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

        <div className="border-t border-white/[0.06] p-3 flex flex-col gap-1">
          <Link href="/inbox" className="text-xs text-white/25 hover:text-white/50 transition-colors">
            ← Inbox
          </Link>
          <Link href="/dashboard" className="text-xs text-white/25 hover:text-white/50 transition-colors">
            ← Dashboard
          </Link>
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
