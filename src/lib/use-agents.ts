"use client";

import { useState, useEffect, useCallback } from "react";
import type { Agent } from "@/lib/types";

const STORAGE_KEY = "synapse-agents";

function readAgents(): Agent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    // Support migrating from the old single-key format
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    // Old format was a plain string (the API key)
    return [];
  } catch {
    return [];
  }
}

function writeAgents(agents: Agent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
}

export function useAgents() {
  const [agents, setAgentsState] = useState<Agent[]>([]);

  useEffect(() => {
    setAgentsState(readAgents());
  }, []);

  const addAgent = useCallback((agent: Agent) => {
    setAgentsState((prev) => {
      const updated = [
        ...prev.filter((a) => a.username !== agent.username),
        agent,
      ];
      writeAgents(updated);
      return updated;
    });
  }, []);

  const removeAgent = useCallback((username: string) => {
    setAgentsState((prev) => {
      const updated = prev.filter((a) => a.username !== username);
      writeAgents(updated);
      return updated;
    });
  }, []);

  const getAgentKey = useCallback(
    (username: string) => agents.find((a) => a.username === username)?.apiKey ?? null,
    [agents]
  );

  return { agents, addAgent, removeAgent, getAgentKey };
}
