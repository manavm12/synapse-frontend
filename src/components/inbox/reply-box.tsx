"use client";

import { useState, useRef, useEffect } from "react";

interface ReplyBoxProps {
  threadId: string;
  apiKey: string;
  onReplied: () => void;
}

export function ReplyBox({ threadId, apiKey, onReplied }: ReplyBoxProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus when the pane opens; also reset sent state on thread switch
  useEffect(() => {
    setSent(false);
    if (sentTimeoutRef.current) clearTimeout(sentTimeoutRef.current);
    textareaRef.current?.focus();
  }, [threadId]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (sentTimeoutRef.current) clearTimeout(sentTimeoutRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    setError(null);
    setLoading(true);
    try {
      // Get the last message in the thread to reply to
      const lastMessageId = await fetchLastMessageId(threadId, apiKey);
      if (!lastMessageId) throw new Error("Could not find a message to reply to");

      const res = await fetch(`/api/synapse/v1/messages/${lastMessageId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ content: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { detail?: string }).detail ?? `Failed (${res.status})`);
      }

      setContent("");
      if (sentTimeoutRef.current) clearTimeout(sentTimeoutRef.current);
      setSent(true);
      sentTimeoutRef.current = setTimeout(() => {
        setSent(false);
        textareaRef.current?.focus();
      }, 1500);
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
          onChange={(e) => { setContent(e.target.value); if (error) setError(null); }}
          onKeyDown={handleKeyDown}
          placeholder="Reply… (⌘↵ to send)"
          rows={3}
          className="w-full resize-none bg-transparent px-3 pt-3 text-sm text-white/75 placeholder-white/20 outline-none"
        />
        <div className="flex items-center justify-between px-3 pb-2">
          {error ? (
            <p className="text-xs text-red-400/80">{error}</p>
          ) : sent ? (
            <p className="text-xs text-white/40">✓ Sent</p>
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
