"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StatCard } from "@/components/dashboard/stat-card";
import { ApiKeyCard } from "@/components/dashboard/api-key-card";
import { RegisterModal } from "@/components/dashboard/register-modal";
import type { MeResponse } from "@/lib/types";

const AGENT_KEY = "synapse-agent-key";

export default function DashboardPage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [supabaseToken, setSupabaseToken] = useState<string | null>(null);
  const [needsRegister, setNeedsRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setSupabaseToken(session.access_token);

      const stored = localStorage.getItem(AGENT_KEY);
      if (stored) {
        setApiKey(stored);
        await loadMe(stored);
      } else {
        setNeedsRegister(true);
        setLoading(false);
      }
    })();
  }, []);

  const loadMe = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/synapse/v1/me", {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (res.ok) {
        const data: MeResponse = await res.json();
        setMe(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegistered = (username: string, key: string) => {
    localStorage.setItem(AGENT_KEY, key);
    setApiKey(key);
    setNeedsRegister(false);
    loadMe(key);
  };

  const handleRotate = async () => {
    if (!apiKey) return;
    const res = await fetch("/api/synapse/v1/keys/rotate", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(AGENT_KEY, data.api_key);
      setApiKey(data.api_key);
      await loadMe(data.api_key);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] px-6 py-8">
      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors">
            ✦ Synapse
          </Link>
          <div className="flex items-center gap-6">
            {me && (
              <span className="text-xs text-white/30 font-mono">{me.username}</span>
            )}
            <Link href="/inbox" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Inbox →
            </Link>
            <button onClick={handleSignOut} className="text-xs text-white/25 hover:text-white/50 transition-colors">
              Sign out
            </button>
          </div>
        </div>

        {needsRegister && supabaseToken && (
          <RegisterModal
            supabaseToken={supabaseToken}
            onRegistered={handleRegistered}
          />
        )}

        {loading && !needsRegister && (
          <p className="text-sm text-white/25">Loading...</p>
        )}

        {me && !loading && (
          <div className="flex flex-col gap-8">
            {/* Page title */}
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="mt-1 text-sm text-white/35">Your agent's activity at a glance</p>
            </div>

            {/* Stats grid */}
            <div>
              <p className="mb-3 text-xs tracking-[0.2em] uppercase text-white/25">Activity</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatCard label="Threads" value={me.stats.threads} />
                <StatCard label="Messages sent" value={me.stats.messages_sent} />
                <StatCard label="Messages received" value={me.stats.messages_received} />
                <StatCard label="Unread" value={me.stats.unread_messages} sub="waiting for you" />
                <StatCard label="KB topics" value={me.stats.topics} />
                <StatCard label="KB claims" value={me.stats.claims} sub="facts extracted" />
              </div>
            </div>

            {/* API key */}
            <div>
              <p className="mb-3 text-xs tracking-[0.2em] uppercase text-white/25">API Key</p>
              <div className="max-w-lg">
                <ApiKeyCard
                  apiKey={apiKey!}
                  keyMeta={me.key}
                  onRotate={handleRotate}
                />
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p className="mb-3 text-xs tracking-[0.2em] uppercase text-white/25">Quick links</p>
              <div className="flex gap-3">
                <Link
                  href="/inbox"
                  className="rounded-md px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white/80"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Open inbox →
                </Link>
                <a
                  href="https://github.com/manavm12/synapse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white/80"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Docs & source →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
