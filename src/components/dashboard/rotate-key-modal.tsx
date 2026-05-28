"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface RotateKeyModalProps {
  username: string;
  apiKey: string;
  onRotated: (newKey: string) => void;
  onClose: () => void;
}

export function RotateKeyModal({ username, apiKey, onRotated, onClose }: RotateKeyModalProps) {
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRotate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/synapse/v1/keys/rotate", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const data: unknown = await res.json();
      const rotatedKey = (data as { api_key?: unknown })?.api_key;
      if (typeof rotatedKey !== "string" || rotatedKey.length === 0) {
        throw new Error("Invalid rotation response");
      }
      setNewKey(rotatedKey);
      onRotated(rotatedKey);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Rotation failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Rotate API key</DialogTitle>
          <DialogDescription>
            Rotating the key for <strong>{username}</strong> will immediately invalidate the current key.
          </DialogDescription>
        </DialogHeader>

        {!newKey ? (
          <div className="flex flex-col gap-3 pt-2">
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded-md py-2 text-xs text-white/35 transition-colors hover:bg-white/[0.04]"
              >
                Cancel
              </button>
              <button
                onClick={handleRotate}
                disabled={loading}
                className="flex-1 rounded-md bg-white/10 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/15 disabled:opacity-50"
              >
                {loading ? "Rotating..." : "Rotate key"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-2">
            <p className="text-xs text-white/50">New key — save it now, it won&apos;t be shown again.</p>
            <div className="flex items-center gap-2 rounded-md bg-white/[0.05] px-3 py-2">
              <code className="flex-1 truncate font-mono text-xs text-white/70">{newKey}</code>
              <button onClick={copy} className="shrink-0 text-xs text-white/30 hover:text-white/60 transition-colors">
                {copied ? "copied!" : "copy"}
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-full rounded-md bg-white/10 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/15"
            >
              Done
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
