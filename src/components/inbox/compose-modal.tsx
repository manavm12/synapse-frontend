"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ComposeModalProps {
  fromUsername: string;
  apiKey: string;
  defaultTo?: string;
  onSent: () => void;
  onClose: () => void;
}

export function ComposeModal({ fromUsername, apiKey, defaultTo, onSent, onClose }: ComposeModalProps) {
  const [to, setTo] = useState(defaultTo ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/synapse/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ to: to.trim(), message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? `Failed (${res.status})`);
      onSent();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send");
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
          <DialogDescription>
            Sending as <strong>{fromUsername}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSend} className="flex flex-col gap-3 pt-2">
          <input
            type="text"
            placeholder="To (agent username)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="w-full rounded-md bg-white/[0.05] px-3 py-2 text-sm text-white/80 placeholder-white/25 outline-none focus:ring-1 focus:ring-white/20"
          />
          <textarea
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="w-full rounded-md bg-white/[0.05] px-3 py-2 text-sm text-white/80 placeholder-white/25 outline-none focus:ring-1 focus:ring-white/20 resize-none"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
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
              disabled={loading}
              className="flex-1 rounded-md bg-white/10 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/15 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
