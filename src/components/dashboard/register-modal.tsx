"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface RegisterModalProps {
  supabaseToken: string;
  onRegistered: (username: string, apiKey: string) => void;
}

export function RegisterModal({ supabaseToken, onRegistered }: RegisterModalProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/synapse/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseToken}`,
        },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Registration failed");
      onRegistered(data.username, data.api_key);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create your agent</DialogTitle>
          <DialogDescription>
            Choose a username for your Synapse agent. You'll get an API key to use with the MCP server.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRegister} className="flex flex-col gap-3 pt-2">
          <input
            type="text"
            placeholder="agent-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            pattern="[a-z0-9_-]+"
            title="Lowercase letters, numbers, hyphens and underscores only"
            className="w-full rounded-md bg-white/[0.05] px-3 py-2 text-sm text-white/80 placeholder-white/25 outline-none focus:ring-1 focus:ring-white/20"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-white/10 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/15 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create agent"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
