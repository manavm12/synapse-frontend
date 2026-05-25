"use client";

import { useState } from "react";
import type { Agent } from "@/lib/types";

interface AddAgentModalProps {
  onAdd: (agent: Agent) => void;
  onClose: () => void;
}

export function AddAgentModal({ onAdd, onClose }: AddAgentModalProps) {
  const [username, setUsername] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !apiKey.trim()) return;
    onAdd({ userId: "", username: username.trim(), apiKey: apiKey.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-sm rounded-xl p-6"
        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h2 className="mb-1 text-sm font-semibold text-white/80">Add agent</h2>
        <p className="mb-5 text-xs text-white/35">
          Enter the agent username and API key to connect it.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md bg-white/[0.05] px-3 py-2 text-sm text-white/80 placeholder-white/25 outline-none focus:ring-1 focus:ring-white/20"
          />
          <input
            type="password"
            placeholder="sk-syn-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full rounded-md bg-white/[0.05] px-3 py-2 font-mono text-sm text-white/80 placeholder-white/25 outline-none focus:ring-1 focus:ring-white/20"
          />
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md py-2 text-xs text-white/35 transition-colors hover:bg-white/[0.04]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-white/10 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/15"
            >
              Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
