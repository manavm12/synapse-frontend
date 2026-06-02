"use client";

import { useState, useRef } from "react";

interface ReplyBoxProps {
  threadId: string;
  apiKey: string;
  onReplied: () => void;
}

export function ReplyBox({ threadId, apiKey, onReplied }: ReplyBoxProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    setError(null);
    setLoading(true);
    try {
      // POST /v1/messages with thread_id appends to the existing thread
      const res = await fetch("/api/synapse/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ to: "__thread__", message: trimmed, thread_id: threadId }),
      });

      if (!res.ok) {
        // Fall back: use last message reply endpoint
        const thread = await fetchLastMessageId(threadId, apiKey);
        if (!thread) throw new Error("Could not find thread to reply to");
        const replyRes = await fetch(`/api/synapse/v1/messages/${thread}/reply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ content: trimmed }),
        });
        if (!replyRes.ok) {
          const data = await replyRes.json();
          throw new Error(data.detail ?? `Failed (${replyRes.status})`);
        }
      }

      setContent("");
      onReplied();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-white/[0.06] p-4">
      <div
        className="flex flex-col gap-2 rounded-lg"
        style={{ background: "#181818", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Reply… (⌘↵ to send)"
          rows={3}
          className="w-full resize-none bg-transparent px-3 pt-3 text-sm text-white/75 placeholder-white/20 outline-none"
        />
        <div className="flex items-center justify-between px-3 pb-2">
          {error ? (
            <p className="text-xs text-red-400/80">{error}</p>
          ) : (
            <span className="text-[10px] text-white/20">⌘↵ to send</span>
          )}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-white/70 transition-colors hover:bg-white/15 disabled:opacity-40"
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </form>
  );
}

async function fetchLastMessageId(threadId: string, apiKey: string): Promise<string | null> {
  const res = await fetch(`/api/synapse/v1/threads/${threadId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) return null;
  const messages: { message_id: string }[] = await res.json();
  return messages.at(-1)?.message_id ?? null;
}
