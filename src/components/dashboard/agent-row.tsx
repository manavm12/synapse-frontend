"use client";

import Link from "next/link";
import { useState } from "react";
import type { Agent } from "@/lib/types";
import { RotateKeyModal } from "@/components/dashboard/rotate-key-modal";

interface AgentRowProps {
  agent: Agent;
  onRemove: (username: string) => void;
  onKeyRotated: (username: string, newKey: string) => void;
}

export function AgentRow({ agent, onRemove, onKeyRotated }: AgentRowProps) {
  const [copied, setCopied] = useState(false);
  const [keyVisible, setKeyVisible] = useState(false);
  const [showRotateModal, setShowRotateModal] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(agent.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <tr className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
      {/* Avatar + username */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold uppercase text-white/60 shrink-0">
            {agent.username[0]}
          </span>
          <span className="text-sm text-white/80 font-medium">{agent.username}</span>
        </div>
      </td>

      {/* API key */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <code className="font-mono text-xs text-white/40">
            {keyVisible ? agent.apiKey : "sk-syn-" + "•".repeat(20)}
          </code>
          <button onClick={() => setKeyVisible(v => !v)} className="text-[10px] text-white/25 hover:text-white/50 transition-colors">
            {keyVisible ? "hide" : "show"}
          </button>
          <button onClick={copy} className="text-[10px] text-white/25 hover:text-white/50 transition-colors">
            {copied ? "copied!" : "copy"}
          </button>
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          {/* ?agent= param is handled by inbox/page.tsx in PR #20 */}
          <Link
            href={`/inbox?agent=${agent.username}`}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Inbox →
          </Link>
          {/* ?agent= param is handled by kb/page.tsx in PR #20 */}
          <Link
            href={`/kb?agent=${agent.username}`}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            KB →
          </Link>
          <button
            onClick={() => setShowRotateModal(true)}
            className="text-xs text-white/20 hover:text-white/50 transition-colors"
          >
            Rotate key
          </button>
          <button
            onClick={() => onRemove(agent.username)}
            className="text-xs text-white/20 hover:text-red-400/60 transition-colors"
          >
            Remove
          </button>
        </div>
      </td>

      {showRotateModal && (
        <td className="p-0">
          <RotateKeyModal
            username={agent.username}
            apiKey={agent.apiKey}
            onRotated={(newKey) => {
              onKeyRotated(agent.username, newKey);
              setShowRotateModal(false);
            }}
            onClose={() => setShowRotateModal(false)}
          />
        </td>
      )}
    </tr>
  );
}
